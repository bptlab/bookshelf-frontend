<template>
  <main class="bookmanagement">
    <SearchableBookgrid 
        title="Bookmanagement"
        description="All books, desired by users, will be displayed here. Use the buttons below each of these to manage the book requests."
        v-bind:books=displayedBooks
        v-bind:onSearch=searchBooks />
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import SearchableBookgrid from '@/components/SearchableBookgrid.vue';
import Component from "vue-class-component";
import Fuse from "fuse.js";
import ChimeraApi from "@/apis/Chimera/ChimeraApi";
import Book from "@/interfaces/Book";
import Dataobject from '@/apis/Chimera/Dataobject';
import DataobjectAttribute from "@/interfaces/chimera/DataobjectAttribute";
import config from "@/config";
import Activity from "@/apis/chimera/Activity";
import Bookshelf from "@/Bookshelf.vue";
import BookAction from "@/interfaces/BookAction";
import { filter, map } from 'p-iteration';

@Component({
  components: {
    SearchableBookgrid,
  },
})
export default class Booklist extends Vue {
  // region public members
  public displayedBooks: Book[] = [];
  // endregion

  // region public methods
  // endregion

  // region private members
  private books: Book[] = [];
  private fuse!: Fuse;
  // endregion

  // region constructor
  // endregion

  // region private methods
  private mounted() {
    ChimeraApi.scenario(config.scenario.id)
      .dataobjects()
      .then(this.filterDataobjects)
      .then(this.mapDataobjectsToBooks)
      .then(this.initializeSearchbar);
  }

  private async filterDataobjects(dataobjects: Dataobject[]): Promise<Dataobject[]> {
    return await filter(dataobjects, async (dataobject: Dataobject): Promise<boolean> => {
      return await dataobject.state == "desired";
    });
  }

  private async mapDataobjectsToBooks(dataobjects: Dataobject[]): Promise<Book[]> {
    const books = await Promise.all(dataobjects.map( async (dataobject: Dataobject): Promise<Book> => {
      const book: Book = {
        title: '',
        subtitle: '',
        authors: '',
        publishedDate: new Date(),
        description: '',
        pageCount: 0,
        language: '',
        printType: '',
        category: '',
        averageRating: 0,
        imageUrl: '',
        infoUrl: '',
      };

      const attributes = await dataobject.attributes;
      attributes.forEach((attribute: DataobjectAttribute) => {
          if (attribute.name == 'publishedDate') {
            book[attribute.name] = new Date(attribute.value);
          } else {
            book[attribute.name] = attribute.value;
          }
        }
      );
      

      const activities = await ChimeraApi
        .scenario(dataobject.scenarioId)
        .instance(dataobject.instanceId)
        .activities();
      const filteredActivities = await filter(activities, 
        async (activity: Activity): Promise<boolean> => {
          return await activity.state === 'READY';
        }
      );

      book.actions = await map(filteredActivities, 
        async (activity: Activity): Promise<BookAction> => {
          return {
            title: await activity.label,
            action: () => { activity.complete([ dataobject ]); },
          }
        }
      );

      return book;
    }));

    this.books = books;
    return this.books;
  }

  private initializeSearchbar(books: Book[]): Book[] {
    const searchConfig = { keys: ["authors", "title"] };

    this.displayedBooks = this.books;
    this.fuse = new Fuse(this.books, searchConfig);
    return this.books;
  }

  private searchBooks(event: any) {
    if (event.target.value === "") {
      this.displayedBooks = this.books;
      return;
    }
    if (this.fuse) {
      this.displayedBooks = this.fuse.search(event.target.value);
    }
  }

  private handleBookAction(book: Book, action: Activity) {
    ChimeraApi.completeActivity(book.instanceId, action.id, book.id);
  }
  // endregion
}
</script>

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
import Vue from 'vue';
import Component from 'vue-class-component';
import { filter, map } from 'p-iteration';
import Fuse from 'fuse.js';
import SearchableBookgrid from '@/components/SearchableBookgrid.vue';
import ChimeraApi from '@/apis/Chimera/ChimeraApi';
import Dataobject from '@/apis/Chimera/Dataobject';
import Activity from '@/apis/chimera/Activity';
import Utils from '@/Utils';
import Book from '@/interfaces/Book';
import BookAction from '@/interfaces/BookAction';
import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';
import config from '@/config';


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
      .then((dataobjects: Dataobject[]) => Utils.filterDataobjectsByState(dataobjects, 'desired'))
      .then(this.mapDataobjectsToBooks)
      .then(this.initializeSearchbar);
  }

  private async mapDataobjectsToBooks(dataobjects: Dataobject[]): Promise<Book[]> {
    const books = await map( dataobjects, async (dataobject: Dataobject): Promise<Book> => {
      const book: Book = await Utils.initializeBook(dataobject);
      book.actions = await this.initializeBookActions(dataobject);
      return book;
    });

    this.books = books;
    return this.books;
  }

  private async initializeBookActions(dataobject: Dataobject): Promise<BookAction[]> {
    const activities = await this.getReadyActivities(dataobject);

    return await map(activities, async (activity: Activity): Promise<BookAction> => {
      return {
        title: await activity.label,
        action: () => { activity.complete([ dataobject ]); },
        disableBook: true,
      };
    });
  }

  private async getReadyActivities(dataobject: Dataobject): Promise<Activity[]> {
    const activities = await ChimeraApi
      .scenario(dataobject.scenarioId)
      .instance(dataobject.instanceId)
      .activities();

    return await filter(activities, async (activity: Activity): Promise<boolean> => {
      return await activity.state === 'READY';
    });
  }

  private initializeSearchbar(books: Book[]): Book[] {
    const searchConfig = { keys: ['authors', 'title'] };

    this.displayedBooks = this.books;
    this.fuse = new Fuse(this.books, searchConfig);
    return this.books;
  }

  private searchBooks(event: any) {
    if (event.target.value === '') {
      this.displayedBooks = this.books;
      return;
    }
    if (this.fuse) {
      this.displayedBooks = this.fuse.search(event.target.value);
    }
  }
  // endregion
}
</script>

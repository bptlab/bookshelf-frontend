<template>
  <div class="booklist">
    <input v-on:keyup="searchBooks" type="text" id="searchbar" class="uk-input uk-margin-bottom" placeholder="Search Books">
    <div class="uk-child-width-1-3@s uk-grid-match uk-grid">

      <div v-for="book in displayedBooks" :key="book.id">
        <div class="uk-card uk-card-default uk-margin-bottom">

            <div class="uk-card-header">
                <div class="uk-grid-small uk-flex-middle uk-grid">
                    <div class="uk-width-expand">
                        <h3 class="uk-card-title uk-margin-remove-bottom">{{book.title}}</h3>
                        <p class="uk-text-meta uk-margin-remove-top"><time datetime="2016-04-01T19:00">April 01, 2016</time></p>
                    </div>
                </div>
            </div>

            <div class="uk-card-body">
                <p>Description</p>
            </div>

            <div class="uk-card-footer">
                <a v-on:click="handleBookAction(book, action)" v-for="action in book.actions" :key="action.id" class="uk-button uk-button-text uk-margin-right">
                  {{ action.label }}
                </a>
            </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Fuse from "fuse.js";
import ChimeraApi from "@/apis/ChimeraApi";
import Book from "@/interfaces/Book";
import Dataobject from "@/interfaces/chimera/Dataobject";
import DataobjectAttribute from "@/interfaces/chimera/DataobjectAttribute";
import config from "@/config";
import Activity from "@/interfaces/chimera/Activity";
import Bookshelf from "@/Bookshelf.vue";

@Component
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
    ChimeraApi.getScenarioDataobjects()
      .then(this.filterDataobjects)
      .then(this.mapDataobjectsToBooks)
      .then(this.initializeSearchbar)
      .then(this.addActions);
  }

  private filterDataobjects(dataobjects: Dataobject[]): Dataobject[] {
    return dataobjects.filter((dataobject: Dataobject) => {
      return dataobject.state == "desired";
    });
  }

  private mapDataobjectsToBooks(dataobjects: Dataobject[]): Book[] {
    const books = dataobjects.map((dataobject: Dataobject) => {
      const book: Book = {
        id: dataobject.id,
        instanceId: dataobject.instanceId,
        state: dataobject.state,
        isbn: "",
        title: "",
        actions: []
      };

      dataobject.attributeConfiguration.forEach(
        (attribute: DataobjectAttribute) => {
          book[attribute.name] = attribute.value;
        }
      );

      return book;
    });
    this.books = books;
    return this.books;
  }

  private initializeSearchbar(books: Book[]): Book[] {
    const searchConfig = { keys: ["state", "isbn", "title"] };

    this.displayedBooks = this.books;
    this.fuse = new Fuse(this.books, searchConfig);
    return this.books;
  }

  private addActions(books: Book[]): Book[] {
    books.map(async (book: Book): Promise<Book> => {
      book.actions = await ChimeraApi.getEnabledActivities(book.instanceId);
      return book
    });
    console.log(books);
    this.books = books;
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

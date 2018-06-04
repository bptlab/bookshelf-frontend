<template>
  <div class="booklist">
    <input v-on:keyup="searchBooks" type="text" id="searchbar" class="uk-input" placeholder="Search Books">
    <table class="uk-table uk-table-divider">
      <thead>
        <tr>
          <th>state</th>
          <th>isbn</th>
          <th>title</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in displayedBooks" :key="book.id">
          <td>{{ book.state }}</td>
          <td>{{ book.isbn }}</td>
          <td>{{ book.title }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Fuse from 'fuse.js';
import ChimeraApi from '@/apis/ChimeraApi';
import Book from '@/interfaces/Book';
import Dataobject from '@/interfaces/chimera/Dataobject';
import DataobjectAttribute from '@/interfaces/chimera/DataobjectAttribute';
import config from '@/config';

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
      .then(this.mapDataobjectsToBooks)
      .then(this.initializeSearchbar);
  }

  private initializeSearchbar() {
    const searchConfig = { keys: ['state', 'isbn', 'title'] };

    this.displayedBooks = this.books;
    this.fuse = new Fuse(this.books, searchConfig);
  }

  private mapDataobjectsToBooks(dataobjects: Dataobject[]) {
    this.books = dataobjects.map((dataobject: Dataobject) => {
      const book: Book = {
        id: dataobject.id,
        state: dataobject.state,
        isbn: '',
        title: '',
      };

      dataobject.attributeConfiguration.forEach(
        (attribute: DataobjectAttribute) => {
          book[attribute.name] = attribute.value;
        },
      );

      return book;
    });
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

<template>
    <div class="bookwish">
        <input v-on:keyup="handleKeyEvent" type="text" id="searchbar" class="uk-input" placeholder="Search Books">
        <table class="uk-table uk-table-divider">
        <thead>
            <tr>
            <th>isbn</th>
            <th>title</th>
            <th>year</th>
            <th>authors</th>
            <th>wish</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>{{ book.isbn }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.publishedDate }}</td>
              <td>{{ book.authors }}</td>
              <td><button v-on:click="handleBookwish(book)" class="uk-button uk-button-default">Add to Wishlist</button></td>
            </tr>
        </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import GoogleApi from '@/apis/GoogleApi';
import ChimeraApi from '@/apis/ChimeraApi';
import Volume from '@/interfaces/google/Volume';
import Book from '@/interfaces/Book';
import config from '@/config';
import { relative } from 'path';

@Component
export default class Bookwish extends Vue {
  // region public members
  public books: Book[] = [];
  // endregion

  // region public methods
  // endregion

  // region private members
  private lastInput: string = '';
  private searchTimeout!: NodeJS.Timer;
  // endregion

  // region constructor
  // endregion

  // region private methods
  private handleKeyEvent(event: any) {
    const input: string = event.target.value;

    if (input === this.lastInput) { return; }
    if (input === '') { return; }

    this.displayLoadingAnimation();
    this.lastInput = input;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(
      () => this.searchBooks(event.target.value),
      600,
    );
  }

  private handleBookwish(book: Book) {
    console.log('Book desired!');
    console.log(book);
    ChimeraApi.startInstance(book);
  }

  private displayLoadingAnimation() {
    // TODO: Implement Animation logic
  }

  private formatBooks(bookResponse: any) {
    this.books = bookResponse.items.map((volume: Volume) => {
      return {
        id: Bookwish.getISBN(volume),
        state: '',
        isbn: Bookwish.getISBN(volume),
        title: volume.volumeInfo.title,
        publishedDate: volume.volumeInfo.publishedDate,
        authors: volume.volumeInfo.authors ? volume.volumeInfo.authors.join(', ') : '',
      }
    });
  }

  private searchBooks(title: string) {
    GoogleApi.getBooksByTitle(title).then(this.formatBooks);
  }

  private static getISBN(volume: Volume): string {
    const identifier = volume.volumeInfo.industryIdentifiers.find((identifier) => {
      return identifier.type == 'ISBN_13';
    });
    if (identifier) {
      return identifier.identifier;
    } else {
      return '';
    }
  }
  // endregion
}
</script>
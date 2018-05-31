<template>
    <div class="bookwish">
        <form>
            <fieldset class="uk-fieldset">
                <div class="uk-margin">
                    <input v-on:keyup="handleKeyEvent" type="text" id="searchbar" class="uk-input" placeholder="Search Books">
                </div>
            </fieldset>
        </form>
        <table class="uk-table uk-table-divider">
        <thead>
            <tr>
            <th>title</th>
            <th>year</th>
            <th>authors</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="book in books" :key="book.id">
            <td>{{ book.volumeInfo.title }}</td>
            <td>{{ book.volumeInfo.publishedDate }}</td>
            <td>{{ book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : '' }}</td>
            </tr>
        </tbody>
        </table>
    </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import GoogleApi from '@/apis/GoogleApi';
import Volume from '@/interfaces/google/Volume';
import config from '@/config';

@Component
export default class Bookwish extends Vue {
  // region public members
  public books: Volume[] = [];
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

  private displayLoadingAnimation() {
    // TODO: Implement Animation logic
  }

  private formatBooks(bookResponse: any) {
    this.books = bookResponse.items;
  }

  private searchBooks(title: string) {
    GoogleApi.getBooksByTitle(title).then(this.formatBooks);
  }
  // endregion
}
</script>
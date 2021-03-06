<template>
    <main class="bookwish">
      <SearchableBookgrid 
        title="Bookwishes"
        description="Missing a book in our library? Use the searchbar below to search for your desired book and request it. You will be notified about the status of your request."
        v-bind:books=books
        v-bind:onSearch=handleSearchEvent />
    </main>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SearchableBookgrid from '@/components/SearchableBookgrid.vue';
import GoogleApi from '@/apis/GoogleApi';
import ChimeraApi from '@/apis/Chimera/ChimeraApi';
import Book from '@/interfaces/Book';
import BookAction from '@/interfaces/BookAction';
import Volume from '@/interfaces/google/Volume';
import config from '@/config';


@Component({
  components: {
    SearchableBookgrid,
  },
})
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
  private handleSearchEvent(event: any) {
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
    ChimeraApi
    .scenario(config.scenario.id)
    .startInstance(config.scenario.caseStart, book);
  }

  private displayLoadingAnimation() {
    // TODO: Implement Animation logic
  }

  private formatBooks(bookResponse: any): Book[] {
    const bookActions = this.initializeBookActions();

    const books: Book[] = bookResponse.items.map((volume: Volume) => {
      return {
        nfcid: '',
        isbn: (volume.id + volume.etag).replace(/[^a-zA-Z0-9]/g, ""),
        title: volume.volumeInfo.title ? volume.volumeInfo.title : '',
        subtitle: volume.volumeInfo.subtitle ? volume.volumeInfo.subtitle : '',
        authors: volume.volumeInfo.authors ? volume.volumeInfo.authors.join(', ') : '',
        publishedDate: new Date(volume.volumeInfo.publishedDate),
        description: volume.volumeInfo.description ? volume.volumeInfo.description : '',
        pageCount: volume.volumeInfo.pageCount ? volume.volumeInfo.pageCount : 0,
        language: volume.volumeInfo.language ? volume.volumeInfo.language : '',
        printType: volume.volumeInfo.printType ? volume.volumeInfo.printType : '',
        category: volume.volumeInfo.categories ? volume.volumeInfo.categories[0] : 'Uncategorized',
        averageRating: volume.volumeInfo.averageRating ? volume.volumeInfo.averageRating : 0,
        imageUrl: volume.volumeInfo.imageLinks ? volume.volumeInfo.imageLinks.thumbnail : '',
        infoUrl: volume.volumeInfo.infoLink ? volume.volumeInfo.infoLink : '',
        actions: bookActions,
      };
    });

    this.books = books;
    return this.books;
  }

  private initializeBookActions(): BookAction[] {
    return [
      {
        title: 'View Details',
        action: (book: Book) => window.open(book.infoUrl, '_blank'),
      },
      {
        title: 'Wish Book',
        action: (book: Book) => this.handleBookwish(book),
      },
    ];
  }

  private searchBooks(title: string) {
    GoogleApi
      .getBooksByTitle(title)
      .then(this.formatBooks);
  }
  // endregion
}
</script>

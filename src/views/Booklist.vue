<template>
  <div class="bookshelf">
    <SearchableBookgrid 
        title="Bookshelf"
        description="Search the BPT Chairs library using this tool. "
        v-bind:books=displayedBooks
        v-bind:onSearch=searchBooks />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import SearchableBookgrid from '@/components/SearchableBookgrid.vue';
import { map } from 'p-iteration';
import Fuse from 'fuse.js';
import ChimeraApi from '@/apis/Chimera/ChimeraApi';
import Dataobject from '@/apis/Chimera/Dataobject';
import Utils from '@/Utils';
import Book from '@/interfaces/Book';
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

<template>
  <main class="home">
    <table class="uk-table uk-table-divider">
      <thead>
        <tr>
          <th>state</th>
          <th>isbn</th>
          <th>title</th>
        </tr>
      </thead>
    <tbody>
      <tr v-for="book in books" :key="book.id">
        <td>{{ book.state }}</td>
        <td>{{ book.isbn }}</td>
        <td>{{ book.title }}</td>
      </tr>
    </tbody>
    </table>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ChimeraApi from '@/ChimeraApi';
import config from '@/config';
import { Dataobject, Attribute } from '@/interfaces/Dataobject';
import Book from '@/interfaces/Book';

@Component
export default class Booklist extends Vue {
  private books: Book[] = [];

  private mounted() {
    ChimeraApi.requestScenarioDataobjects().then(this.formatBooks);
  }

  private formatBooks(dataobjects: Dataobject[]) {
    this.books = dataobjects.map((dataobject: Dataobject) => {
      const book: Book = {
        id: dataobject.id,
        state: dataobject.state,
        isbn: '',
        title: '',
      };

      dataobject.attributeConfiguration.forEach((attribute: Attribute) => {
        book[attribute.name] = attribute.value;
      });
      return book;
    });
  }
}
</script>
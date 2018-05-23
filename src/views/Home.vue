<template>
  <main class="home">
    <h1>This is the home page</h1>
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

@Component
export default class Bookshelf extends Vue {
  public books: object[] = [];

  public parseBooks(rawBooks: any) {
    this.books = rawBooks.map((rawBook: any) => {
      let book: any = {
        id: rawBook.id,
        state: rawBook.state
      };

      rawBook.attributeConfiguration.forEach((attribute: any) => {
        book[attribute.name] = attribute.value;
      });
      return book
    });
  }

  public mounted() {
    fetch('http://localhost:3000/chimera/api/interface/v2/scenario/23c9eee3cff64082978086cecc3dd29e/instance/b229d88eb0f7409db6776fcf89b94f66/dataobject').then((response: any) => {
      return response.json();
    }).then(this.parseBooks);
  }
}
</script>
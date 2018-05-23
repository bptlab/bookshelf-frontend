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
import config from '@/config';

@Component
export default class Bookshelf extends Vue {
  public books: object[] = [];

  public formatBooks(rawBooks: any) {
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

  private requestScenarioDataobjects() {
    console.log('called scenario DO');
    let url = config.api.chimera.base + 'interface/v2/scenario/' + config.scenario.id + '/instance';

    fetch(url).then((response: any) => {
      return response.json();
    }).then((instances: any) => {
      instances.forEach((instance: any) => {
        this.requestInstanceDataobjects(instance.id);
      });
    });
  }

  private requestInstanceDataobjects(instanceId: string) {
    console.log('called instance DO' + instanceId);
    let url = config.api.chimera.base + 'interface/v2/scenario/' + config.scenario.id + '/instance/' + instanceId + '/dataobject';
    
    fetch(url).then((response: any) => {
      return response.json();
    }).then(this.formatBooks);
  }



  public mounted() {
    this.requestScenarioDataobjects();
  }
}
</script>
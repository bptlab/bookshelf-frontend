<template>
  <div class="booklist">
    <input v-on:keyup="searchBooks" type="text" id="searchbar" class="uk-input uk-margin-large-bottom" placeholder="Search Books">
    <div class="uk-child-width-1-3@s uk-grid-match uk-grid">
      
        <!-- Post-->
        <div class="post-module">
          <!-- Thumbnail-->
          <div class="thumbnail">
            <div class="date">
              <div class="day">27</div>
              <div class="month">Mar</div>
            </div><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg">
          </div>
          <!-- Post Content-->
          <div class="post-content">
            <div class="category">Photos</div>
            <h1 class="title">City Lights in New York</h1>
            <h2 class="sub_title">The city that never sleeps.</h2>
            <p class="description">New York, the largest city in the U.S., is an architectural marvel with plenty of historic monuments, magnificent buildings and countless dazzling skyscrapers.</p>
            <div class="post-meta"><span class="timestamp"><i class="fa fa-clock-">o</i> 6 mins ago</span><span class="comments"><i class="fa fa-comments"></i><a href="#"> 39 comments</a></span></div>
          </div>
        </div>
      </div>

      <div v-for="book in displayedBooks" :key="book.id">
        <div class="column uk-margin-medium-bottom">
          <!-- Post-->
          <div class="post-module">
            <!-- Thumbnail-->
            <div class="thumbnail">
              <div class="date">
                <div class="day">2017</div>
                <div class="month">Mar</div>
              </div><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/photo-1429043794791-eb8f26f44081.jpeg">
            </div>
            <!-- Post Content-->
            <div class="post-content">
              <div class="category">Book</div>
              <h1 class="title">{{book.title}}</h1>
              <h2 class="sub_title">The city that never sleeps.</h2>
              <p class="description">New York, the largest city in the U.S., is an architectural marvel with plenty of historic monuments, magnificent buildings and countless dazzling skyscrapers.</p>
              <div class="post-meta">
                <a class="actions" v-on:click="handleBookAction(book, action)" v-for="action in book.actions" :key="action.id">
                  {{ action.label }}
                </a>
              </div>
            </div>
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
      return book;
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

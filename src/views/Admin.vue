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


<style lang="less">

// Variables
@white: #FFFFFF;
@black: #000000;
@dark_gray: lighten(@black, 20%);
@gray: lighten(@black, 40%);
@light_gray: lighten(@black, 60%);


// Mixins
.border-radius( @radius: 3px; ) {
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
  border-radius: @radius;
}

.box-shadow( @h-shadow: 0px; @v-shadow: 1px; @blur: 2px; @spread: 0px; @color: fade(@black, 15%); ) {
  -webkit-box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  box-shadow: @arguments;
}

.transitions( @property: all; @duration: 0.3s; @timing: linear; @delay: 0s; ) {
  -webkit-transition: @arguments;
  -moz-transition: @arguments;
  -ms-transition: @arguments;
  -o-transition: @arguments;
  transition: @arguments;
}

.box-size( @property: border-box; ) {
  -webkti-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.font-smoothing() {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Code by Andy Tran
// Design by JustinKwak
@accent: #e74c3c;

@container_width: 800px;

body {
  font-family: 'proxima-nova-soft', sans-serif;
  font-size: 14px;
  .font-smoothing;
}

.post-module {
  position: relative;
  z-index: 1;
  display: block;
  background: @white;
  min-width: 270px;
  height: 470px;
  .box-shadow;
  .transitions;
  &:hover {
    .box-shadow(@blur: 35px; @color: fade(@black, 30%););
    .thumbnail {
      img {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        transform: scale(1.1);
        opacity: .6;
      }
    }
    .post-content .description {
      opacity: 1;
      height: 100px;
      margin: 20px 0px;
      visibility: visible;
    }
  }
  .thumbnail {
    background: @black;
    height: 400px;
    overflow: hidden;
    .date {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1;
      background: @accent;
      width: 55px;
      height: 55px;
      padding: 4.5px 0;
      .border-radius(100%);
      color: @white;
      font-weight: 700;
      text-align: center;
      .box-size;
      .day {
        font-size: 18px;
      }
      .month {
        font-size: 12px;
        text-transform: uppercase;
      }
    }
    img {
      display: block;
      width: 120%;
      .transitions;
    }
  }
  .post-content {
    position: absolute;
    bottom: 0;
    background: @white;
    width: 100%;
    padding: 30px;
    .box-size;
    .transitions(@timing: cubic-bezier(.37,.75,.61,1.05));
    .category {
      position: absolute;
      top: -34px;
      left: 0;
      background: @accent;
      padding: 10px 15px;
      color: @white;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .title {
      margin: 0 0 10px;
      padding: 0;
      color: @dark_gray;
      font-size: 26px;
      font-weight: 700;
    }
    .sub_title {
      margin: 0 0 20px;
      padding: 0;
      color: @accent;
      font-size: 20px;
      font-weight: 400;
    }
    .description {
      overflow: hidden;
      opacity: 0;
      height: 0;
      margin: 0;
      transition: opacity 300ms, height 300ms, margin 300ms;
      color: @gray;
      font-size: 14px;
      line-height: 1.8em;
    }
    .post-meta {
      margin: 0 0 25px;
      color: @light_gray;
      .timestamp {
        margin: 0 16px 0 0;
      }
      .actions {
        text-transform: capitalize;
      }
      a {
        color: @light_gray;
        text-decoration: none;
      }
    }
  }
}

.hover {
  &:extend(.post-module:hover all);
  .post-content {
    .description {
      display: block !important;
      height: auto !important;
      opacity: 1 !important;
    }
  }
}



.container {
  max-width: @container_width;
  min-width: 640px;
  margin: 0 auto;
  &:before,
  &:after {
    content: '';
    display: block;
    clear: both;
  }
  .column {
    width: 50%;
    padding: 0 25px;
    .box-size;
    float: left;
    .demo-title {
      margin: 0 0 15px;
      color: @gray;
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
    }
  }
  .info {
    width: 300px;
    margin: 50px auto;
    text-align: center;
    h1 {
      margin: 0 0 15px;
      padding: 0;
      font-size: 24px;
      font-weight: bold;
      color: @dark_gray;
    }
    span {
      color: @gray;
      font-size: 12px;
      a {
        color: @black;
        text-decoration: none;
      }
      .fa {
        color: @accent;
      }
    }
  }
}
</style>
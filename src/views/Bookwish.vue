<template>
    <div class="bookwish">
      <section class="title uk-margin-large-bottom">
        <h1 class="uk-margin-top">Bookwishes</h1>
        <h3 class="uk-margin-small-top uk-margin-large-bottom">Missing a book in our library? Use the searchbar below to search for your desired book and request it. You will be notified about the status of your request.</h3>
      </section>
      <input v-on:keyup="handleKeyEvent" type="text" id="searchbar" class="uk-input uk-margin-large-bottom" placeholder="Search Books">
      <div class="uk-child-width-1-3@s uk-grid-match uk-grid">

        <div v-for="book in books" :key="book.id">
          <div class="column uk-margin-medium-bottom">
            <!-- Post-->
            <div class="post-module">
              <!-- Thumbnail-->
              <div class="thumbnail">
                <div class="date">
                  <div class="day">{{book.publishedDate.getFullYear()}}</div>
                  <div class="month">{{book.publishedDate.toLocaleString("en-us", { month: "short" })}}</div>
                </div><img v-bind:src="book.imageUrl">
              </div>
              <!-- Post Content-->
              <div class="post-content">
                <div class="category">{{ book.categories[0] ? book.categories[0] : 'Uncategorized' }}</div>
                <h1 class="title">{{book.title}}</h1>
                <h2 class="sub_title">{{book.authors.join(', ')}}</h2>
                <p class="description">{{book.description}}</p>
                <div class="post-meta">
                  <span class="timestamp">
                    <i class="fas fa-book"></i> {{book.pageCount}} pages
                  </span>
                  <span v-if="book.averageRating" class="comments">
                     <i class="fas fa-star"></i> {{ book.averageRating }} / 5
                  </span>
                </div>
                <div class="post-actions">
                  <a target="_blank" v-if="book.infoUrl" v-bind:href="book.infoUrl">
                    View Details
                  </a>
                  <a v-on:click="handleBookwish(book)">
                    Wish Book
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
    ChimeraApi.startInstance(book);
  }

  private displayLoadingAnimation() {
    // TODO: Implement Animation logic
  }

  private formatBooks(bookResponse: any) {
    this.books = bookResponse.items.map((volume: Volume) => {
      console.log(volume);
      return {
        title: volume.volumeInfo.title,
        subtitle: volume.volumeInfo.subtitle,
        authors: volume.volumeInfo.authors ? volume.volumeInfo.authors : [],
        publishedDate: new Date(volume.volumeInfo.publishedDate),
        description: volume.volumeInfo.description,
        pageCount: volume.volumeInfo.pageCount,
        language: volume.volumeInfo.language,
        printType: volume.volumeInfo.printType,
        mainCategory: volume.volumeInfo.mainCategory,
        categories: volume.volumeInfo.categories ? volume.volumeInfo.categories : [],
        averageRating: volume.volumeInfo.averageRating,
        imageUrl: volume.volumeInfo.imageLinks ? volume.volumeInfo.imageLinks.thumbnail : '',
        infoUrl: volume.volumeInfo.infoLink,
      }
    });
  }

  private searchBooks(title: string) {
    GoogleApi
      .getBooksByTitle(title)
      .then(this.formatBooks);
  }
  // endregion
}
</script>

<style lang="less">
  section.title {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1, h3 {
      max-width: 600px;
    }

    h3 {
      text-align: justify;
    }
  }

  .max-lines(@lines, @line-height) {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @lines;
    line-height: @line-height;
    max-height: @lines * @line-height;
    overflow: hidden;
  }

  .post-module {
    h1.title {
      .max-lines(3, 1.2);
    }
    h2.sub_title {
      .max-lines(2, 1.3)
    }

    .post-actions {
      position: absolute;
      bottom: 0;
      left: 0;
      justify-content: space-around;
      display: flex;
      width: 100%;
      border-top: solid 1px #EFEFEF;
      padding: 10px 0px;

      a {
        font-size: 15px;
        color: #9B9B9B;

        &:hover {
          color: #E34E47;
          text-decoration: none;
        }
      }
    }
  }
</style>

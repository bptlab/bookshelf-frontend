<template>
    <div class="bookgrid">
      <section class="title uk-margin-large-bottom">
        <h1 class="uk-margin-top">{{title}}</h1>
        <h3 class="uk-margin-small-top uk-margin-large-bottom">{{description}}</h3>
      </section>
      
      <input v-on:keyup="handleSearchEvent" type="text" id="searchbar" class="uk-input uk-margin-large-bottom" placeholder="Search Books">
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
                <div class="category">{{ book.category }}</div>
                <h1 class="title">{{book.title}}</h1>
                <h2 class="sub_title">{{book.authors}}</h2>
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
                  <a v-for="(action, index) in book.actions" :key="index" v-on:click="action.action(book)">
                    {{action.title}}
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
import Book from '@/interfaces/Book';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class SearchableBookgrid extends Vue {
  // region properties
  @Prop({default: 'Title'})
  title!: string;

  @Prop({default: 'Description text...'})
  description!: string;

  @Prop()
  books!: Book[];

  @Prop()
  onSearch!: (event: any) => any;
  // endregion

  // region public members
  // endregion

  // region public methods
  // endregion

  // region private members
  // endregion

  // region constructor
  // endregion

  // region private methods
  private handleSearchEvent(event: any) {
    this.onSearch(event);
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

  // Variables
  @white: #FFFFFF;
  @black: #000000;
  @dark_gray: lighten(@black, 20%);
  @gray: lighten(@black, 40%);
  @light_gray: lighten(@black, 60%);


  // Mixins
  .max-lines(@lines, @line-height) {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: @lines;
    line-height: @line-height;
    max-height: @lines * @line-height;
    overflow: hidden;
  }

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
        .max-lines(3, 1.2);
        margin: 0 0 10px;
        padding: 0;
        color: @dark_gray;
        font-size: 26px;
        font-weight: 700;
      }
      .sub_title {
        .max-lines(2, 1.3);
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

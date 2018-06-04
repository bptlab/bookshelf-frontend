<template>
    <header class="uk-margin">
        <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
            <nav class="uk-navbar-container uk-navbar">
                <div class="uk-navbar-left">
                    <ul class="uk-navbar-nav">
                        <li>
                            <router-link to="/">Shelf</router-link>
                        </li>
                        <li>
                            <router-link to="/wish">Wish</router-link>
                        </li>
                        <li>
                            <router-link to="/admin">Admin</router-link>
                        </li>
                    </ul>
                </div>
                <div class="uk-navbar-right">
                    <ul class="uk-navbar-nav">
                        <li>
                            <router-link v-if="loggedIn" to="/logout">Log out</router-link>
                            <router-link v-if="!loggedIn" to="/login">Log in</router-link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Authentification from '@/apis/Authentification';

@Component
export default class Header extends Vue {
  // region public members
  public loggedIn: boolean;
  // endregion

  // region public methods
  // endregion

  // region private members
  // endregion

  // region constructor
  constructor() {
    super();
    this.loggedIn = Authentification.loggedIn();
    Authentification.onChange = (loggedIn) => {
      this.loggedIn = loggedIn;
    };
  }
  // endregion

  // region private methods
  // endregion
}
</script>

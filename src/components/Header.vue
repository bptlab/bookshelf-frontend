<template>
    <header class="uk-margin-large-bottom">
        <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
            <nav class="uk-navbar-container uk-light" uk-navbar="dropbar: true;" style="position: relative; z-index: 980;">
                <div class="uk-navbar-left">
                    <ul class="uk-navbar-nav">
                        <h1 class="logo">BPM Bookshelf</h1>
                    </ul>
                </div>
                <div class="uk-navbar-right">
                    <ul class="uk-navbar-nav">
                        <li>
                            <router-link to="/">Shelf</router-link>
                        </li>
                        <li>
                            <router-link to="/wish">Wish</router-link>
                        </li>
                        <li>
                            <router-link v-if="loggedIn" to="/admin">Admin</router-link>
                        </li>
                        <li>
                            <router-link v-if="loggedIn" to="/add-user">Add User</router-link>
                        </li>
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
import 'uikit';

@Component
export default class Header extends Vue {
  // region public members
  public loggedIn: boolean = false;
  // endregion

  // region public methods
  // endregion

  // region private members
  // endregion

  // region constructor
  // endregion

  // region private methods
  private mounted() {
    this.loggedIn = Authentification.loggedIn();
    Authentification.onChange = (loggedIn) => {
        this.loggedIn = loggedIn;
    };
  }
  // endregion
}
</script>

<style lang="less">

.uk-navbar-container {
    background: transparent !important;
}

.uk-sticky {
    background: #E34E47;
}

h1.logo {
    margin-left: 15px;
    margin-bottom: 0;
    font-size: 25px;
}

h1.logo, .uk-navbar-nav a {
    color: #EFEFEF !important;
}

</style>

<template>
  <form @submit.prevent="login">
    <fieldset class="uk-fieldset">

      <legend class="uk-legend">Login</legend>

      <div class="uk-margin">
        <input class="uk-input" v-bind:class="{ 'uk-form-danger': error }" v-model="username" placeholder="Username">
      </div>

      <div class="uk-margin">
        <input class="uk-input" v-bind:class="{ 'uk-form-danger': error }" v-model="password" type="password" placeholder="Password">
      </div>

      <div class="uk-margin" uk-margin>
          <button type="submit" class="uk-button uk-button-default">Login</button>
      </div>

    </fieldset>
  </form>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import Authentification from '@/apis/Authentification';

@Component
export default class Login extends Vue {
  // region public members
  public username: string = '';
  public password: string = '';
  public error: boolean = false;
  // endregion

  // region public methods
  // endregion

  // region private members
  // endregion

  // region constructor
  // endregion

  // region private methods
  private login() {
    Authentification.login(this.username, this.password, (loggedIn) => {
      if (!loggedIn) {
        this.error = true;
      } else {
        this.$router.replace(this.$route.query.redirect || '/');
      }
    });
  }
  // endregion
}
</script>

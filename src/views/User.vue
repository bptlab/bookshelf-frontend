<template>
  <form @submit.prevent="createUser">
    <fieldset class="uk-fieldset">

      <legend class="uk-legend">Create new User</legend>

      <div v-if="noInstanceError">
          Could not create a user, because no instance exists.
      </div>

      <div class="uk-margin">
        <input class="uk-input" v-bind:class="{ 'uk-form-danger': error }" v-model="name" placeholder="Name">
      </div>

      <div class="uk-margin">
        <input class="uk-input" v-bind:class="{ 'uk-form-danger': error }" v-model="email" type="email" placeholder="E-Mail">
      </div>

      <div class="uk-margin" uk-margin>
          <button type="submit" class="uk-button uk-button-default">Create User</button>
      </div>

    </fieldset>
  </form>
</template>

<script lang='ts'>
import Vue from 'vue';
import Component from 'vue-class-component';
import Authentification from '@/apis/Authentification';
import ChimeraApi from '@/apis/Chimera/ChimeraApi';
import Instance from '@/apis/Chimera/Instance';
import Activity from '@/apis/Chimera/Activity';
import { filter, find } from 'p-iteration';
import config from '@/config';

@Component
export default class User extends Vue {
  // region public members
  public name: string = '';
  public email: string = '';
  public error: boolean = false;
  public noInstanceError: boolean = false;
  // endregion

  // region public methods
  // endregion

  // region private members
  // endregion

  // region constructor
  // endregion

  // region private methods
  private async createUser() {
    if (this.name === '' || this.email === '') {
        this.error = true;
        return;
    }

    const instances: Instance[] = await ChimeraApi.scenario(config.scenario.id).instances();
    if (instances.length <= 0) {
        this.noInstanceError = true;
        return;
    }

    const activities = await instances[0].activities();
    const createUserActivity: Activity = await find(
        activities, 
        async (activity: Activity): Promise<boolean> => {
            return await activity.label === 'Fill User data';
        }
    );

    const currentTime = + new Date();
    createUserActivity.completeWithoutInput({
        UserRegistration: {
            UserId: currentTime,
            Name: this.name,
            Mail: this.email,
        }
    });
  }
  // endregion
}
</script>

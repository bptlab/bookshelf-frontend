<template>
    <div id="bookshelf">
        <Header />
        <main class="uk-container">
          <router-view></router-view>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';

@Component({
  components: {
    Header,
  },
})

export default class Bookshelf extends Vue {}
</script>

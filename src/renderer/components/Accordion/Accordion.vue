<template>
  <div class="accordion">
    <div
      v-for="(item, i) in accordionItems"
      :key="i"
      :index="i"
      class="accordion__item"
    >
      <div
        :class="item.header.open ? 'accordion__header--open' : 'accordion__header'"
        @click="() => toggleOpen(i)"
      > 
        <p class="accordion__header-text">
          {{ item.header.text }}
        </p>
        <i
          v-if="item.header.open"
          class="icon-minus"
        />
        <i
          v-else
          class="icon-plus"
        />
      </div>
      <div :class="item.header.open ? 'accordion__content--open' : 'accordion__content'">
        <div
          v-if="item.content.isComponent"
          class="accordion__content-text"
        >
          <component
            :is="components[removeSpace(item.header.text)]"
            v-bind="item.content.text.props"
          />
        </div>
        <div
          v-else
          class="accordion__content-text"
        > 
          <div
            v-if="item.content.textFormat==='md'"
            v-html="markdown(item.content.text)"
          />
          <p v-else>
            {{ item.content.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toRef, ref, onMounted, defineAsyncComponent} from "vue";
export default {
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  setup(props) {

    const MarkdownIt = require("markdown-it");
    const markdownIt = new MarkdownIt();


    const accordionItems = toRef(props, "items");
    const components = ref({});

    function toggleOpen(index) {
      accordionItems.value = accordionItems.value.map((item, i) => {
        if(index === i) {
          item.header.open = !item.header.open;
        }
        return item;
      });
    }

    function markdown(text){
      return markdownIt.render(text);
    }


    function removeSpace(text){
      return text.replaceAll(" ", "");
    }

    onMounted(()=>{
      for(var i = 0; i < props.items.length; i++){
        if(props.items[i].content.isComponent){
          components.value[removeSpace(props.items[i].header.text)] = defineAsyncComponent(props.items[i].content.text.component);
        }
      }
    });
    


    return { accordionItems, toggleOpen, removeSpace,components,markdown};
  }
};
</script>

<style lang="scss" scoped>
    .accordion {
        width: 100%;
    }
    .accordion__item {
        display: block;
        width: 100%;
        margin: 5px auto;
        border-radius: 10px;
        background: none;

    }
    .accordion__item .accordion__header .accordion__header-text {
      width: inherit;
      margin: 0;
      color: $inactive-state;
    }

    .accordion__item .accordion__header--open .accordion__header-text {
      width: inherit;
      margin: 0;
      color: $high-emphasis-text;
    }
    
    .accordion__item .accordion__header {
        cursor: pointer;
        border-radius: 5px;
        padding: 10px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        position: relative;
        transition: all 0.5s linear;
    }
    .accordion__item .accordion__header i {
        color: $inactive-state;
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-30%) rotate(0deg);
        width: 30px;
        height: 30px;
    }
    .accordion__item .accordion__header:hover {
        background: $primary-dark-3;
    }
    .accordion__item .accordion__header--open {
        background: $primary-dark-3;
        border-radius: 5px 5px 0 0;
        cursor: pointer;
        padding: 10px;
        width: 100%;
        border: none;
        text-align: left;
        outline: none;
        position: relative;
        transition: all 0.5s linear;
    }
    .accordion__item .accordion__header--open i {
        color: $high-emphasis-text;
        content: '';
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-30%) rotate(0deg);
        width: 30px;
        height: 30px;
    }
    .accordion__item .accordion__header--open:hover {
        background: $primary-dark-3;
    }
    .accordion__item .accordion__content {
        opacity: 0;
        overflow: hidden;
        max-height: 0;
        transition: all 0.5s ease-out;
    }
    .accordion__item .accordion__content-text {
      padding: 15px;
      
    }
    .accordion__item .accordion__content--open {
        border-radius: 0 0 5px 5px;
        color: $high-emphasis-text;
        opacity: 1;
        overflow: hidden;
        max-height: 2000px;
        transition: all 0.5s ease-in;
    }
</style>
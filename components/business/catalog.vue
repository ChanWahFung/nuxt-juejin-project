<template>
  <div class="catalog">
    <div class="catalog__title">目录</div>
    <div class="catalog__body">
      <ul class="catalog__list">
        <li class="catalog-item ellipsis" :class="[c1.level, {'catalog-item--active' : c1.id === currentCatalogId }]" v-for="c1 in data" :key="c1.id">
          <a :href="'#'+c1.id" :title="c1.title" @click="currentCatalogId = c1.id">{{ c1.title }}</a>
          <ul v-if="c1.children.length">
            <li class="catalog-item ellipsis" :class="[c2.level, {'catalog-item--active' : c2.id === currentCatalogId }]" v-for="c2 in c1.children" :key="c2.id">
              <a :href="'#'+c2.id" :title="c2.title" @click="currentCatalogId = c2.id">{{ c2.title }}</a>
              <ul v-if="c2.children.length">
                <li class="catalog-item ellipsis" :class="[c3.level, {'catalog-item--active' : c3.id === currentCatalogId }]" v-for="c3 in c2.children" :key="c3.id">
                  <a :href="'#'+c3.id" :title="c3.title" @click="currentCatalogId = c3.id">{{ c3.title }}</a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentCatalogId: ''
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.catalog{
  margin-top: 20px;

  .catalog__title{
    font-size: 14px;
  }

  .catalog__body{
    overflow: hidden;
  }
}
.catalog__list{
  position: relative;

  &::before{
    content: "";
    position: absolute;
    top: 0;
    left: 7px;
    bottom: 0;
    width: 2px;
    background-color: #ebedef;
    opacity: .5;
  }

  .catalog-item{
    font-size: 14px;
    font-weight: 400;
    line-height: 1.3;
    color: #333;
    list-style: none;

    &.catalog-item--active{
      color: $theme;
      
      >a{
        background: #ebedef;
      }
    }

    a {
      position: relative;
      display: block;
      margin: 6px 0;
      padding: 4px 0 4px 21px;
      color: inherit;
      text-decoration: none;

      &:hover{
        background: #ebedef;
      }

      &::before{
        content: "";
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -2px;
        width: 4px;
        height: 4px;
        background-color: currentColor;
        border-radius: 50%;
      }
    }

    &.c1{
      font-weight: 600;

      >a::before{
        left: 5px;
        margin-top: -3px;
        width: 6px;
        height: 6px;
      }
    }

    &.c2{
      >a{
        margin: 0;
        padding-left: 36px;

        &::before{
          left: 24px;
        }
      }
    }

    &.c3{
      >a{
        margin: 0;
        padding-left: 51px;

        &::before{
          left: 39px;
        }
      }
    }
  }
}
</style>
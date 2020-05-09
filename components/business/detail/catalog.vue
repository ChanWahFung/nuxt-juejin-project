<template>
  <div class="catalog" :class="[{'catalog--sticky': isSticky}, {'is-topbar-block': isTopbarBlock}]" @scroll.stop="()=>{}">
    <div v-show="catalogData.length" class="catalog__title">目录</div>
    <div class="catalog__body">
      <ul class="catalog__list">
        <li class="catalog-item" :class="[c1.level, {'catalog-item--active' : c1.id === currentCatalogId }]" v-for="c1 in catalogData" :key="c1.id">
          <a class="ellipsis" :href="'#'+c1.id" :title="c1.title" @click="currentCatalogId = c1.id">{{ c1.title }}</a>
          <ul v-if="c1.children.length">
            <li class="catalog-item" :class="[c2.level, {'catalog-item--active' : c2.id === currentCatalogId }]" v-for="c2 in c1.children" :key="c2.id">
              <a class="ellipsis" :href="'#'+c2.id" :title="c2.title" @click="currentCatalogId = c2.id">{{ c2.title }}</a>
              <ul v-if="c2.children.length">
                <li class="catalog-item" :class="[c3.level, {'catalog-item--active' : c3.id === currentCatalogId }]" v-for="c3 in c2.children" :key="c3.id">
                  <a class="ellipsis" :href="'#'+c3.id" :title="c3.title" @click="currentCatalogId = c3.id">{{ c3.title }}</a>
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
import { mapState } from 'vuex'

export default {
  data() {
    return {
      catalogOffsetTop: 800,
      currentCatalogId: '',
      catalogData: [],
      isSticky: false
    }
  },
  computed: {
    ...mapState([
      'isTopbarBlock'
    ])
  },
  mounted() {
    this.createCatalog()
    this.catalogOffsetTop = document.querySelector('.catalog').offsetTop
    window.addEventListener('scroll', this.catalogSticky)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.catalogSticky)
  },
  methods: {
    // 控制目录吸顶
    catalogSticky() {
      let scrollTop = document.scrollingElement.scrollTop
      if (scrollTop + 70 >= this.catalogOffsetTop && this.isSticky == false) {
        this.isSticky = true
      }
      if (scrollTop + 70 < this.catalogOffsetTop && this.isSticky) {
        this.isSticky = false
      }
    },
    // 生成目录树数据
    createCatalog() {
      let catalog = []
      function Item(id, item, level){
        this.id = id
        this.title = item.textContent || '<未识别标题>'
        this.tag = item.tagName
        this.level = level
        this.children = []
      }
      // 加入一级目录
      function addC1(item){
        catalog.push({ ...item, level: 'c1' })
      }
      // 加入二级目录
      function addC2(item){
        let lastC1 = catalog[catalog.length - 1]
        if (!lastC1) {
          addC1(item)
          return
        }
        lastC1.children.push({ ...item, level: 'c2' })
      }
      // 加入三级目录
      function addC3(item){
        const lastC1 = catalog[catalog.length - 1]
        if (!lastC1) {
          addC1(item)
          return
        }
        let lastC2 = lastC1.children[lastC1.children.length - 1]
        if (!lastC2) {
          addC2(item)
          return
        }
        lastC2.children.push({ ...item, level: 'c3' })
      }
      document.querySelectorAll('.detail__content h1,h2,h3,h4,h5,h6').forEach((item, index) => {
        item.setAttribute('id', `heading-${index}`)
        const catalogItem = new Item(`heading-${index}`, item)
        if (!catalog[0]) {
          addC1(catalogItem)
          return
        }
        const lastC1 = catalog[catalog.length - 1]
        const lastC2 = lastC1.children[lastC1.children.length - 1]
        if (item.tagName == 'H1') {
          addC1(catalogItem)
        } else if (item.tagName == 'H2') {
          if (lastC1.tag === 'H1') {
            addC2(catalogItem)
          } else {
            addC1(catalogItem)
          }
        } else if (item.tagName == 'H3') {
          if (lastC1.tag === 'H1' && lastC2 && lastC2.tag === 'H2') {
            addC3(catalogItem)
          } else if (lastC1.tag === 'H1' || lastC1.tag === 'H2') {
            addC2(catalogItem)
          } else {
            addC1(catalogItem)
          }
        } else {
          addC3(catalogItem)
        }
      })
      this.catalogData = catalog
    }
  }
}
</script>

<style lang='scss' scoped>
.catalog{
  padding-right: 10px;
  margin-top: 20px;
  transition: all .2s;

  &.catalog--sticky{
    width: 240px;
    height: 95vh;
    position: fixed;
    top: 0;
    overflow-y: auto;

    &::-webkit-scrollbar{
      display: none;
      width: 3px;
    }
    &::-webkit-scrollbar-thumb{
      background: #e9e9e9;
    }
    &::-webkit-scrollbar-track{
      background: transparent;
    }
    &:hover::-webkit-scrollbar{
      display: block;
    }
  }

  &.is-topbar-block{
    height: 90vh;
    top: 50px;
  }

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
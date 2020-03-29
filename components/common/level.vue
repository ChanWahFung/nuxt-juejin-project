<template functional>
  <img v-if="props.level == 1" src="~/assets/images/lv-1.svg" />
  <img v-else-if="props.level == 2" src="~/assets/images/lv-2.svg" />
  <img v-else-if="props.level == 3" src="~/assets/images/lv-3.svg" />
  <img v-else-if="props.level == 4" src="~/assets/images/lv-4.svg" />
  <img v-else-if="props.level == 5" src="~/assets/images/lv-5.svg" />
  <img v-else-if="props.level == 6" src="~/assets/images/lv-6.svg" />
</template>
<template>
  <!-- https://vuetifyjs.com/en/components/navigation-drawers/ -->
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    app
    clipped
  >
    <!-- https://vuetifyjs.com/en/components/lists/ -->
    <v-list dense nav>
      <nav-drawer-item
        v-for="route of routes"
        :key="route.name"
        :route="route"
        :base-path="route.path"
        :prepend-icon="(route.meta || {}).icon"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import NavDrawerItem from './RAdminNavDrawer'

function createNavRoutes(routes) {
  return routes.reduce((list, current) => {
    const shallow = Object.assign({}, current)

    if (shallow.meta && !shallow.meta.hidden && shallow.meta.title) {
      if (shallow.children) {
        shallow.children = createNavRoutes(shallow.children)
      }

      if (!shallow.children || shallow.children.length) {
        list.push(shallow)
      }
    }
    return list
  }, [])
}

export default {
  name: 'RAdminNav',

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      // Navigation sidebar should only be initialized once, so we froze object
      // to avoid redundant reactive observer
      routes: Object.freeze(createNavRoutes(this.$store.state.user.routes))
    }
  },

  components: {
    NavDrawerItem
  }
}
</script>

<style lang="sass" scoped></style>

<h1 style="text-align: center;">My Gantt</h1>

## 📦 Install

```
npm install vue-timelines --save
```

```html
// component.vue
<script>
  import MyGantt from "vue-timelines";

  export default {
    // ...
    components: {
      Timeline,
    },
    // ...
  };
</script>
```

## 🔧 Usage

```html
<template>
  <MyGantt
    :groups="taskGroups"
    @update="handleUpdatedTasks"
  />
</template>

<script>
  import MyGantt from 'vue-timelines'

  export default {
    components: {
      MyGantt
    }
    data: () => ({
      taskGroups:  groups: [
        {
          name: "group 01",
          id: "1",
          tasks: [
            {
              id: "01",
              title: "Test task 01",
              creationDate: 1641437099,
              duedate: 1651805099,
              progress: 0.8,
            },
            {
              id: "02",
              title: "Test task 02",
              creationDate: 1643856299,
              duedate: 1649126699,
              progress: 0.5,
            },
          ],
        },
        {
          name: "group 02",
          id: "2",
          tasks: [
            {
              id: "03",
              title: "Test task 03",
              creationDate: 1649041200,
              duedate: 1650510000,
              progress: 0.8,
            },
            {
              id: "04",
              title: "Test task 04",
              creationDate: 1650596400,
              duedate: 1651374000,
              progress: 0.5,
            },
            {
              id: "05",
              title: "Test task 05",
              creationDate: 1651719600,
              duedate: 1651892400,
              progress: 0.5,
            },
            {
              id: "06",
              title: "Test task 06",
              creationDate: 1652151600,
              duedate: 1652324400,
              progress: 0.5,
            },
          ],
        },
      ],
    })
    methods: {
        handleUpdatedTasks: function (updatedTasks) {
            // ...
        }
    }
  }
</script>
```



import { mapState, mapGetters, mapMutations } from "vuex";
import { getTimestampNow } from "@/utils/date";

function getHeaders(json) {
    console.log(json);
    return {
        mode: 'cors',
        method: 'post',
        headers: {
            'HTTP_KEY': process.env.VUE_APP_API_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
    }
}

/* Get Fetch with headers */
function apiGetFetch(url, json = {}) {
    return fetch(process.env.VUE_APP_API_BASE_URL + url, getHeaders(json))
        .then(response => response.json())
        .then(data => {
            if (data.status != "success") {
                alert(data.error_msg);
                return Promise.reject(data.error_msg);
            }
            return data;
        })
        .catch((error) => {
            console.log(error);
            alert(error)
            return Promise.reject(error);
        });
}

export default {
    namespaced: true,
    state() {
        return {
            id: null,
            start_date: null,
            end_date: null,
            title: "API TIMELINE TITLE",
            groups: [],
            tasks: [],
        };
    },
    getters: {
        findTaskById(state, taskId) {
            return state.tasks.find(task => task.id === taskId);
        },
    },
    mutations: {
        // Mutations have to call our API to update changes.
        setTitle(state, title) {
            state.title = title;
        },
        addNewGroup(state, group) {
            // Creates an empty new group and appends it to the end.
            const newGroup = {
                ...group,
                etype: "GROUP",
                parent_id: state.id,
            }

            apiGetFetch("/events/create", newGroup)
                .then(data => {
                    let e = data.event;
                    if (e.name == "default group") {
                        e.name += " " + (state.groups.length + 1);
                    }

                    state.groups = [...state.groups, data.event];
                    return data;
                })
        },
        updateGroup(state, group) {
            apiGetFetch("/events/update", group);
        },
        renameGroup(state, group) {
            apiGetFetch("/events/" + group.id + "/set/name?value=" + encodeURI(group.name));
        },
        setGroups(state, groups) {
            state.groups = groups;
        },
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        setTimeline(state, json) {
            console.log(" SET NEW TIMELINE")
            let event = json.event;

            state.id = event.id;
            state.start_date = event.start_date;
            state.end_date = event.end_date;

            if ('groups' in event)
                state.groups = event.groups;
            else {
                state.groups = [];
                this.commit('api/addNewGroup', { name: "default group" });
            }

            if ('tasks' in event)
                state.tasks = event.tasks;
            else
                state.tasks = [];

            if ('title' in event)
                state.title = event.title;
            else
                state.title = "EMPTY TITLE";

            this.commit('setCalendarSize', { calendarInit: event.start_date, calendarEnd: event.end_date });
        },
        updateTask(state, updatedTask) {
            let idx = state.tasks.findIndex(task => task.id === updatedTask.id);

            if (idx === -1) {
                // If we cannot find this task by ID then this is a new task.
                state.tasks.push(updatedTask);
                return
            }

            state.tasks[idx] = updatedTask;
        },
    },
    actions: {
        listTasks(state) {
            for (const key in state.tasks) {
                const t = state.tasks[key];
                console.log(
                    key +
                    ": (" +
                    t.title +
                    ") GROUP " +
                    t.group_id +
                    "[" +
                    new Date(t.creationDate * 1000).toLocaleDateString() +
                    "] [" +
                    new Date(t.dueDate * 1000).toLocaleDateString() +
                    "]"
                );
            }
        },
        test() {
            console.log(" TEST API ACTION ");
        },
        testObj(state, obj) {
            console.log(" TEST API PARAM " + obj.title);
        },
        async createTimeline(state, newTimeline) {
            newTimeline.etype = "TIMELINE";
            return apiGetFetch("/events/create", newTimeline)
                .then(data => {
                    this.commit('api/setTimeline', data);
                    return data;
                })
        },
    }
}

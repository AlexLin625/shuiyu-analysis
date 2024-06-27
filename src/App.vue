<script setup>
import {ref} from 'vue'
import axios from "axios";

import Toast from "primevue/toast";
import Header from "@/components/Header.vue";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Chart from "primevue/chart";
import Button from "primevue/button";
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

import {useToast} from "primevue/usetoast";
import Brief from "@/components/Brief.vue";
import Subtitle from "@/components/Subtitle.vue";

const toast = useToast();

const api = axios.create({
    baseURL: "/api/",
});

import {
    b50labels,
    computeBaseline,
    ds2index,
    getAverageRating,
    getBaseline,
    getHistogram,
    minmaxFromList
} from "@/utils.js";

const queryB50 = ref(true);
const username = ref("");

const fetched = ref(false);
const briefInfo = ref({});
let result = null;

const baselineOption = {
    scales: {
        y: {
            beginAtZero: false,
            min: 90,
            max: 102,
        },
    }
};

function fetchB50(username, b50 = true) {
    if (username === "") {
        toast.add({severity: "error", summary: "错误", detail: "请输入用户名. "});
        return;
    }

    let payload = {
        username: username,
        b50: b50,
    };

    api.post("player", payload)
        .then((response) => {
            result = response.data;
            parseResult();
            fetched.value = true;
        })
        .catch((error) => {
            toast.add({severity: "error", summary: "错误", detail: "查询失败. 信息为" + error.message});
        });
}

function calculateBriefInfo() {
    let brief = {
        当前Rating: result.rating,
        B15最高Rating: null,
        B15最低Rating: null,
        B35最高Rating: null,
        B35最低Rating: null,
    };

    let b15 = minmaxFromList(result.charts.dx);
    let b35 = minmaxFromList(result.charts.sd);
    brief.B15最高Rating = b15.maxRating;
    brief.B15最低Rating = b15.minRating;
    brief.B35最高Rating = b35.maxRating;
    brief.B35最低Rating = b35.minRating;

    briefInfo.value = brief;
}

function parseResult() {
    calculateBriefInfo();
}

const accentColor = {
    "sd": "#42A5F5",
    "dx": "#ee915e",
}

function HistogramGraph(type) {
    if (!result)
        return {};

    let data = result.charts[type];
    let histogram = getHistogram(data);
    let labels = b50labels;

    return {
        labels: labels,
        datasets: [
            {
                label: type.toUpperCase() + " 歌曲数目",
                data: histogram,
                backgroundColor: accentColor[type],
            },
        ],
    }
}

function BaselineGraph(type) {
    if (!result)
        return {};

    let data = result.charts[type];
    let labels = b50labels;
    let avg = getAverageRating(data);

    const lut = {
        "sd": "B35最低Rating",
        "dx": "B15最低Rating",
    };

    let baselines = computeBaseline(briefInfo.value[lut[type]]);

    return {
        labels: labels,
        datasets: [
            {
                type: "line",
                label: type.toUpperCase() + " 提分基线",
                data: baselines,
                borderColor: "#de4316",
                fill: false,
            },
            {
                type: "bar",
                label: type.toUpperCase() + " 平均达成率",
                data: avg,
                backgroundColor: accentColor[type],
            },
        ],
    }
}

</script>

<template>
    <Toast/>

    <div class="w-full flex flex-col justify-center items-center">
        <div class="main-container">
            <Header/>

            <div v-if="!fetched" class="w-full flex-col">

                <Tabs value="0">
                    <TabList>
                        <Tab value="0">仅查询B50</Tab>
                        <Tab value="1">完整数据</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel value="0">
                            <div class="flex flex-row w-full items-center justify-between">
                                <InputText v-model="username" type="text" placeholder="水鱼查分用户名"/>
                                <Button @click="fetchB50(username, queryB50)" class="justify-self-end">查询</Button>
                            </div>

                            <div class="rounded-lg bg-gray-100 p-2 my-4">
                                <p class="text-sm text-gray-500 py-1">
                                    如果查询失败，请检查你的用户名以及你的水鱼站隐私设置。
                                </p>
                            </div>
                        </TabPanel>
                        <TabPanel value="1">
                            <div class="rounded-lg bg-gray-100 p-2 my-4">
                                <p class="text-sm text-gray-500 py-1">
                                    需要提供Token. 将会提供查询完整游玩记录，并作出更多可视化的功能。
                                </p>

                                <p class="text-sm text-gray-500 py-1">
                                    锐意制作中。
                                </p>
                            </div>
                        </TabPanel>
                    </TabPanels>
                </Tabs>


            </div>
            <div v-else class="flex flex-col items-start w-full">
                <Subtitle text="B50概览"/>
                <Brief :briefInfo="briefInfo"/>

                <Subtitle text="分数直方图"/>
                <Chart type="bar" :data="HistogramGraph('sd')" class="w-full"/>
                <p class="w-full text-center text-sm text-gray-500 py-2">B35 歌曲难度-数量</p>
                <Chart type="bar" :data="HistogramGraph('dx')" class="w-full"/>
                <p class="w-full text-center text-sm text-gray-500 py-2">B15 歌曲难度-数量</p>

                <Subtitle text="提分基线"/>
                <Chart type="bar" :data="BaselineGraph('sd')" class="w-full" :options="baselineOption"/>
                <p class="w-full text-center text-sm text-gray-500 py-2">B35 平均达成率-提分基线</p>
                <Chart type="bar" :data="BaselineGraph('dx')" class="w-full" :options="baselineOption"/>
                <p class="w-full text-center text-sm text-gray-500 py-2">B15 平均达成率-提分基线</p>

                <div class="rounded-lg bg-gray-100 p-1 my-2">
                    <p class="text-sm text-gray-500 py-1">
                        以上定数档中选取的定数规则如下。
                    </p>
                    <p class="text-sm text-gray-500 py-1">
                        对于整数档，选择x.2 . 对于加号档，选择x.7.
                        例如，对于定数档 12+，选择12.7. 当然，15级只有唯一的15.0.

                        如果吃分线低于97%，图上会显示97%. 如果你不能在此分数档吃分(也就是这些谱面太简单了)，图上会显示为101%.
                    </p>
                </div>
                <Button @click="fetched = false" class="w-full my-4">返回</Button>
            </div>
        </div>
    </div>

</template>

<style>

</style>


import { createApp } from "./create-app-with-my-DI";

const app = createApp();

export const useAllFeatures = app.useAllFeatures
export const useDIFeature = app.useDIFeature;
export const useTaskManagerFeature = () => useAllFeatures().TaskManagerFeature;
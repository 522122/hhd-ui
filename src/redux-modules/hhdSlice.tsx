import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { set } from "lodash";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  updateHhdState,
} from "./hhdAsyncThunks";
import { RootState } from "./store";

export type SettingType =
  | "bool"
  | "container"
  | "mode"
  | "discrete"
  | "multiple"
  | "int";

export type SettingsType = {
  type: SettingType;
  title: string;
  default?: any;
  hint?: string;
  options?: any;
  modes?: any;
  min?: number;
  max?: number;
  children?: { [childName: string]: SettingsType };
};

interface HhdState {
  settingsState?: any;
  settings?: any;
  loading: { [loadState: string]: "idle" | "pending" | "succeeded" | "failed" };
}

const initialState = {
  settingsState: {},
  settings: {},
  loading: {
    settings: "idle",
    settingsState: "idle",
    updateHhdState: "idle",
  },
} as HhdState;

const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    updateHhdState: (
      store,
      action: PayloadAction<{ path: string; value: any }>
    ) => {
      const { path, value } = action.payload;
      set(store.settingsState, path, value);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHhdSettings.pending, (state) => {
      state.loading.settings = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading.settings = "succeeded";
    });
    builder.addCase(fetchHhdSettingsState.pending, (state) => {
      state.loading.settingsState = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.settingsState = "succeeded";
    });

    builder.addCase(updateHhdState.pending, (state) => {
      state.loading.updateHhdState = "pending";
    });
    builder.addCase(updateHhdState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.updateHhdState = "succeeded";
    });
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};

export const selectHhdSettingsState = (state: RootState) => {
  return state.hhd.settingsState;
};

const selectHhdSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

const selectHhdSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.settingsState;

export const selectUpdateHhdStatePending = (state: RootState) => {
  return state.hhd.loading.updateHhdState === "pending";
};

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectHhdSettingsLoading(state) === "pending" ||
    selectHhdSettingsStateLoading(state) === "pending"
  );
};

export default hhdSlice;

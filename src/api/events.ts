import api from "@/api";

import { FormValues as StartupCafeSchema } from "@/components/event-forms/startup-cafe";
import { FormValues as StartupMughavariSchema } from "@/components/event-forms/startup-mughavari";
import { FormValues as InternHuntSchema } from "@/components/event-forms/intern-hunt";
import { FormValues as StartupAtlasSchema } from "@/components/event-forms/startup-atlas";
import { FormValues as PitchXSchema } from "@/components/event-forms/pitch-x";
import { FormValues as GurusPitchSchema } from "@/components/event-forms/guru-pitch";
import { FormValues as StartupDistrictSchema } from "@/components/event-forms/startup-district";
import { FormValues as ScholarSpinoffSchema } from "@/components/event-forms/scholar-spinoff";
import { FormValues as StartupPathFinderSchema } from "@/components/event-forms/startup-path-finder";
import { FormValues as GoldenStarECellSchema } from "@/components/event-forms/golden-ecell";
import { FormValues as FounderFindSchema } from "@/components/event-forms/founder-find";
import { FormValues as IpToIpoSchema } from "@/components/event-forms/ip-to-ipo";

export async function apiCreateStartupCafeProject(
  body: StartupCafeSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/startup-cafe/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiGetCollegesForStartupCafe() {
  try {
    let response = await api.get("/v1/startup-cafe/colleges");

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.colleges;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateStartupMughavariProject(
  body: StartupMughavariSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/startup-mughavari/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateInternHuntProject(
  body: InternHuntSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/intern-hunt/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateStartupAtlasProject(
  body: StartupAtlasSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/startup-atlas/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreatePitchXProject(
  body: PitchXSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/pitch-x/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateGurusPitchProject(
  body: GurusPitchSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/gurus-pitch/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateStartupDistrictProject(
  body: StartupDistrictSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/startup-district/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateScholarSpinOffProject(
  body: ScholarSpinoffSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/scholar-spinoff/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateStartupPathFinderProject(
  body: StartupPathFinderSchema & { paymentId: string }
) {
  try {
    let response = await api.post(
      "/v1/startup-path-finder/create-project",
      body
    );

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateGoldenStarECellProject(
  body: GoldenStarECellSchema
) {
  try {
    let response = await api.post("/v1/golden-star-ecell/create-award", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateFounderFindProject(
  body: FounderFindSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/founder-find/create-founder", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

export async function apiCreateIpToIpoProject(
  body: IpToIpoSchema & { paymentId: string }
) {
  try {
    let response = await api.post("/v1/ip-to-ipo/create-project", body);

    const { success, data } = response.data;

    if (!success) throw new Error("Server Error, Try again later!!");

    return data.message;
  } catch (error: any) {
    if (error.response) throw error.response.data;
    throw error;
  }
}

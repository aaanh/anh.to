import type { Config } from "vike/types";
import vikePhoton from "vike-photon/config";
import vikeReact from "vike-react/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "anh.to Link Manager",
  description: "Manage short links for anh.to",

  extends: [vikeReact, vikePhoton],
} satisfies Config;

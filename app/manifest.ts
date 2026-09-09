import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "うさぎの学習室",
    short_name: "うさぎ学習",
    description: "もふまるといっしょに、楽しく合格へ。",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf4",
    theme_color: "#71a885",
  };
}

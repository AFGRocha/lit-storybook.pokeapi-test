import { html } from "lit";
import "../my-filters";

export default {
  title: "MyFilters",
  component: "my-filters",
  args: {
    filterTitle: "Filter",
    filterType: "Type",
    filterItems: ["fire", "water", "grass", "electric"],
    showImages: true,
  },
  argTypes: {
    filterTitle: { control: "text" },
    filterType: { control: "text" },
    filterItems: { control: "object" },
    showImages: { control: "boolean" },
  },
};

export const Default = (args: any) => html`
  <my-filters 
    .filterTitle=${args.filterTitle}
    .filterType=${args.filterType}
    .filterItems=${args.filterItems}
    ?showImages=${args.showImages}
  ></my-filters>
`;

export const NoFilters = (args: any) => html`
  <my-filters 
    .filterTitle=${args.filterTitle}
    .filterType=${args.filterType}
    .filterItems=${[]}
    ?showImages=${args.showImages}
  ></my-filters>
`;
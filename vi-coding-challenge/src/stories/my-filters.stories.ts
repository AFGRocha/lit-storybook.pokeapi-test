import { html } from "lit";
import "../my-filters";

export default {
  title: "MyFilters",
  component: "my-filters",
  args: {
    filterTitle: "Filter",
    filterType: "Type",
    filterItems: [
      { name: "fire", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/10.png" },
      { name: "water", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/11.png" },
      { name: "grass", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/12.png" },
      { name: "electric", image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/small/13.png" }
    ],
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

export const NoImages = (args: any) => html`
  <my-filters 
    .filterTitle=${args.filterTitle}
    .filterType=${args.filterType}
    .filterItems=${args.filterItems}
  ></my-filters>
`;
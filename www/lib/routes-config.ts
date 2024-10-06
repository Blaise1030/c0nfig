// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "Commands", href: "/commands" },
      { title: "Operations", href: "/operations" },
      { title: 'Variables', 'href': '/variables' },
    ],
  },
  {
    title: "Commands",
    href: "/commands",
    noLink: true,
    items: [
      { title: "init", href: "/init" },
      { title: "run", href: "/run" },
      { title: "verify", href: "/verify" },
    ],
  },
  {
    title: "Operations",
    href: "/operations",
    noLink: true,
    items: [
      { title: "add", href: "/add" },
      { title: "add-export", href: "/add-export" },
      { title: "add-import", href: "/add-import" },
      { title: "conditional", href: "/conditional" },
      { title: "input", href: "/input" },
      { title: "install", href: "/install" },
      { title: "readJSON", href: "/readJSON" },
      { title: "select", href: "/select" },
      { title: "updateJSON", href: "/updateJSON" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();

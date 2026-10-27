export type BlogPost = {
  title: string;
  date: string;
  slug: string;
  html: string;
};

const postFiles = import.meta.glob("../_posts/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

export const blogPosts = Object.entries(postFiles)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

function parsePost(path: string, raw: string): BlogPost {
  const [, frontmatter = "", markdown = raw] = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/) ?? [];
  const title = readFrontmatter(frontmatter, "title") ?? pathToTitle(path);
  const date = normalizeDate(readFrontmatter(frontmatter, "date")) ?? pathToDate(path);

  return {
    title,
    date,
    slug: pathToSlug(path),
    html: markdownToHtml(markdown),
  };
}

function readFrontmatter(frontmatter: string, key: string) {
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1].trim();
  return value?.replace(/^["']|["']$/g, "");
}

function normalizeDate(value?: string) {
  const match = value?.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (!match) {
    return undefined;
  }

  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function pathToSlug(path: string) {
  return path
    .split("/")
    .pop()!
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\.md$/, "");
}

function pathToDate(path: string) {
  return path.split("/").pop()?.slice(0, 10) ?? "";
}

function pathToTitle(path: string) {
  return pathToSlug(path)
    .replace(/[-.]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function markdownToHtml(markdown: string) {
  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map(renderBlock).join("");
}

function renderBlock(block: string) {
  if (/^[-*_]{3,}$/.test(block)) {
    return "<hr />";
  }

  const heading = block.match(/^(#{1,4})\s+(.+)$/);
  if (heading) {
    const level = Math.min(heading[1].length + 2, 4);
    return `<h${level}>${renderInline(heading[2])}</h${level}>`;
  }

  const image = block.match(/^!\[[^\]]*]\(([^)]+)\)$/);
  if (image) {
    return `<figure><img src="${escapeAttribute(image[1])}" alt="" loading="lazy" /></figure>`;
  }

  const list = block.split("\n").filter((line) => /^(\d+\.|-)\s+/.test(line));
  if (list.length > 1) {
    return `<ul>${list
      .map((line) => `<li>${renderInline(line.replace(/^(\d+\.|-)\s+/, ""))}</li>`)
      .join("")}</ul>`;
  }

  return `<p>${renderInline(block.replace(/\n/g, " "))}</p>`;
}

function renderInline(text: string) {
  return escapeHtml(text).replace(
    /\[([^\]]+)]\(([^)]+)\)/g,
    (_match, label: string, href: string) =>
      `<a href="${escapeAttribute(href)}" target="_blank" rel="noreferrer">${label}</a>`,
  );
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttribute(text: string) {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

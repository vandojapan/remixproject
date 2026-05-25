import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getBlog } from "~/libs/microcms.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.blog.title ?? "Blog";

  return [
    { title: `${title} | Blog` },
    {
      name: "description",
      content: data?.blog.description ?? "microCMS powered blog post.",
    },
  ];
};

export async function loader({ context, params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const blog = await getBlog(context, params.id);

  return json({ blog });
}

export default function BlogDetail() {
  const { blog } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-stone-50 text-gray-950">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12 md:py-16">
        <Link
          to="/blog"
          className="w-fit text-sm font-semibold text-emerald-700 hover:underline"
        >
          Back to articles
        </Link>

        <header className="flex flex-col gap-5 border-b border-gray-200 pb-8">
          <time className="text-sm text-gray-500">
            {formatDate(blog.publishedAt ?? blog.createdAt)}
          </time>
          <h1 className="text-4xl font-bold leading-tight tracking-normal md:text-5xl">
            {blog.title}
          </h1>
          {blog.description ? (
            <p className="text-lg leading-8 text-gray-600">
              {blog.description}
            </p>
          ) : null}
        </header>

        {blog.eyecatch ? (
          <img
            src={blog.eyecatch.url}
            alt=""
            className="aspect-video w-full object-cover"
          />
        ) : null}

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
        />
      </article>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

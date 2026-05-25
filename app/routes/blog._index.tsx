import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getBlogs } from "~/libs/microcms.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Blog" },
    { name: "description", content: "microCMS powered blog posts." },
  ];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Math.max(Number(url.searchParams.get("page") ?? "1"), 1);
  const limit = 12;
  const offset = (page - 1) * limit;
  const blogs = await getBlogs(context, { limit, offset });

  return json({ blogs, page, hasNext: offset + limit < blogs.totalCount });
}

export default function BlogIndex() {
  const { blogs, page, hasNext } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-stone-50 text-gray-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 md:py-16">
        <div className="flex flex-col gap-3 border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Blog
          </p>
          <h1 className="text-4xl font-bold tracking-normal md:text-5xl">
            Articles
          </h1>
        </div>

        {blogs.contents.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {blogs.contents.map((blog) => (
              <article
                key={blog.id}
                className="border border-gray-200 bg-white p-5 shadow-sm"
              >
                {blog.eyecatch ? (
                  <img
                    src={blog.eyecatch.url}
                    alt=""
                    className="mb-5 aspect-video w-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                <div className="flex flex-col gap-3">
                  <time className="text-sm text-gray-500">
                    {formatDate(blog.publishedAt ?? blog.createdAt)}
                  </time>
                  <h2 className="text-2xl font-semibold leading-tight">
                    <Link
                      to={`/blog/${blog.id}`}
                      className="hover:text-emerald-700 hover:underline"
                    >
                      {blog.title}
                    </Link>
                  </h2>
                  {blog.description ? (
                    <p className="line-clamp-3 leading-7 text-gray-600">
                      {blog.description}
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="border border-gray-200 bg-white p-6 text-gray-600">
            記事はまだありません。
          </p>
        )}

        <nav className="flex items-center justify-between border-t border-gray-200 pt-6">
          {page > 1 ? (
            <Link
              to={`/blog?page=${page - 1}`}
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          {hasNext ? (
            <Link
              to={`/blog?page=${page + 1}`}
              className="text-sm font-semibold text-emerald-700 hover:underline"
            >
              Next
            </Link>
          ) : null}
        </nav>
      </section>
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

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { getHomePosts } from '../api/getPosts'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPagination,
} from '@/components/ui/carousel'

export const BlogPreview = async ({ className }: { className?: string }) => {
  const latestPost = await getHomePosts(6)

  return (
    <section className={cn('container', className)}>
      <h2 className="mb-6 text-center text-xl font-bold text-stone-900 sm:mb-12 sm:text-2xl md:mb-16 md:text-3xl">
        بلاگ املاین
      </h2>

      <Carousel
        opts={{
          align: 'center',
          direction: 'rtl',
          breakpoints: { '(min-width: 768px)': { align: 'start' } },
        }}
      >
        <CarouselContent>
          {latestPost.map(post => (
            <CarouselItem key={post.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
              <a
                href={post.link}
                className="group relative flex aspect-308/440 w-full overflow-hidden rounded-lg bg-linear-to-b from-black/0 to-black/80"
              >
                <Image
                  fill
                  src={
                    post._embedded?.['wp:featuredmedia']?.[0].source_url ||
                    '/images/placeholder.png'
                  }
                  alt={post.title.rendered}
                  className="-z-10 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="mt-auto flex flex-col px-2 py-4 text-white sm:px-4 sm:py-6">
                  <div className="text-xs max-sm:mb-0.5 sm:text-base">
                    {new Date(post.date).toLocaleDateString('fa-IR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </div>
                  <h4 className="line-clamp-2 text-xs font-bold sm:text-base xl:text-lg">
                    {post.title.rendered}
                  </h4>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPagination />
      </Carousel>
    </section>
  )
}

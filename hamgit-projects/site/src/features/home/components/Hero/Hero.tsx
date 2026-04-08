import Image from 'next/image'
import { siteConfig } from '@/config/site'
import { env } from '@/config/env'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { ClockIcon, ShieldCheckIcon } from '@/assets/icons'

import classes from './Hero.module.css'

export const Hero = () => (
  <section className={classes.root}>
    <Image
      fill
      priority
      fetchPriority="high"
      alt="بنر اصلی"
      src="/images/banners/hero.webp"
      className="-z-10 object-cover max-sm:hidden"
    />

    <div className="container flex h-full">
      <div className="flex-1 max-sm:hidden" />

      <div className="flex-1">
        <div className={classes.content}>
          <h2 className={classes.title}>
            دوست داری قرارداد رهن و اجاره رو <span className="text-[1.2em] font-bold">آسون</span>{' '}
            بنویسی؟!
          </h2>

          <div className={classes.benefits}>
            <div className={classes['benefit-item']}>
              <ClockIcon className="text-primary size-[2.4em] shrink-0" />
              <span className="text-teal-900">در کمترین زمان و هزینه</span>
            </div>

            <div className={classes['benefit-item']}>
              <ShieldCheckIcon className="text-primary size-[2.4em] shrink-0" />
              <span className="text-teal-900">انعقاد قرارداد معتبر</span>
            </div>
          </div>

          <Button className={classes['button--create-contract']} variant="outline" asChild>
            <a href={`${env.APP_URL}/contracts/new`}>ایجاد قرارداد جدید</a>
          </Button>

          <Button className={classes['button--login']} asChild>
            <a href={`${env.APP_URL}`}>ورود به وب اپ املاین</a>
          </Button>

          <Drawer>
            <DrawerTrigger asChild>
              <Button className={classes['button--download']} variant="outline">
                دانلود اپلیکیشن املاین
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-stone-500">دانلود اپلیکیشن املاین</DrawerTitle>
              </DrawerHeader>

              <DrawerFooter className="mb-4 flex-row flex-wrap justify-center">
                {Object.entries(siteConfig.download).map(([key, link]) => (
                  <a key={key} href={link} target="_blank">
                    <Image
                      src={`/images/badges/${key.toLowerCase()}.png`}
                      alt={`دانلود ${key}`}
                      width={132}
                      height={39}
                    />
                  </a>
                ))}

                <Image src={`/images/badges/ios.png`} alt="دانلود ios" width={132} height={39} />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <div className={classes.links}>
            {Object.entries(siteConfig.download).map(([key, link]) => (
              <a key={key} href={link} target="_blank">
                <Image
                  src={`/images/badges/${key.toLowerCase()}.png`}
                  alt={key}
                  width={130}
                  height={39}
                />
              </a>
            ))}

            <div>
              <Image src={`/images/badges/ios.png`} alt="ios" width={130} height={39} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

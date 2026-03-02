import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';
import { ProductsModule } from './products/products.module';
import { BannersModule } from './banners/banners.module';
import { GalleryModule } from './gallery/gallery.module';
import { VideosModule } from './videos/videos.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AdminUsersModule,
    AuthModule,
    CategoriesModule,
    SubCategoriesModule,
    ProductsModule,
    BannersModule,
    GalleryModule,
    VideosModule,
    InquiriesModule,
    TestimonialsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}

import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import { authenticateAdmin, generateToken } from "./_core/auth";

const COOKIE_NAME = "adminToken";

export const appRouter = router({
  system: systemRouter,

  // =======================
  // AUTH ROUTER
  // =======================
  auth: router({
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await authenticateAdmin(input.username, input.password);
        
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const token = generateToken(user);

        if (ctx.res?.setHeader) {
          ctx.res.setHeader(
            "Set-Cookie",
            `${COOKIE_NAME}=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${ctx.req.secure ? '; Secure' : ''}`
          );
        }

        return { success: true, token, user };
      }),

    me: publicProcedure.query(({ ctx }) => {
      return ctx.user || null;
    }),

    logout: publicProcedure.mutation(({ ctx }) => {
      if (ctx.res?.setHeader) {
        ctx.res.setHeader(
          "Set-Cookie",
          `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
        );
      }
      return { success: true };
    }),
  }),

  // =======================
  // ADMIN ROUTER
  // =======================
  admin: router({
    getPageContent: publicProcedure
      .input(z.object({ pageKey: z.string() }))
      .query(({ input }) => db.getPageContent(input.pageKey)),

    updatePageContent: protectedProcedure
      .input(
        z.object({
          id: z.union([z.string(), z.number()]).optional(),
          pageKey: z.string(),
          headline: z.string().optional(),
          subHeadline: z.string().optional(),
          missionText: z.string().optional(),
          visionText: z.string().optional(),
          studentsTrained: z.number().optional(),
          expertInstructors: z.number().optional(),
          jobPlacementRate: z.number().optional(),
          heroImageUrl: z.string().optional(),
          bannerImageUrl: z.string().optional(),
          founderImageUrl: z.string().optional(),
          companyImageUrl: z.string().optional(),
          missionImageUrl: z.string().optional(),
          visionImageUrl: z.string().optional(),
          founderBio: z.string().optional(),
          founderMessage: z.string().optional(),
          aboutCompany: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, pageKey, ...data } = input;
        await db.updatePageContent(pageKey, data);
        return { success: true };
      }),

    // COURSES
    getCourses: publicProcedure.query(() => db.getCourses()),

    createCourse: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          duration: z.string().optional(),
          level: z.string().optional(),
          instructor: z.string().optional(),
          priceEgp: z.number().default(0),
          priceUsd: z.number().default(0),
          courseLink: z.string().optional(),
          category: z.string().optional(),
          courseType: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await db.createCourse({
          ...input,
          priceEgp: String(input.priceEgp),
          priceUsd: String(input.priceUsd),
        } as any);
      }),

    updateCourse: protectedProcedure
      .input(
        z.object({
          id: z.union([z.string(), z.number()]).transform(String),
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          duration: z.string().optional(),
          level: z.string().optional(),
          instructor: z.string().optional(),
          priceEgp: z.number().optional(),
          priceUsd: z.number().optional(),
          courseLink: z.string().optional(),
          category: z.string().optional(),
          courseType: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const updates: any = { ...data };
        if (data.priceEgp !== undefined) updates.priceEgp = String(data.priceEgp);
        if (data.priceUsd !== undefined) updates.priceUsd = String(data.priceUsd);
        await db.updateCourse(id, updates);
        return { success: true };
      }),

    deleteCourse: protectedProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteCourse(input.id);
        return { success: true };
      }),

    // PROGRAMS
    getPrograms: publicProcedure.query(() => db.getPrograms()),

    createProgram: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          title_ar: z.string().optional(),
          description: z.string().optional(),
          description_ar: z.string().optional(),
          imageUrl: z.string().optional(),
          duration: z.string().optional(),
          skills: z.string().optional(),
          category: z.string().default("space"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // @ts-ignore
        return await db.createProgram(input);
      }),

    updateProgram: protectedProcedure
      .input(
        z.object({
          id: z.union([z.string(), z.number()]).transform(String),
          title: z.string().optional(),
          title_ar: z.string().optional(),
          description: z.string().optional(),
          description_ar: z.string().optional(),
          imageUrl: z.string().optional(),
          duration: z.string().optional(),
          skills: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateProgram(id, data);
        return { success: true };
      }),

    deleteProgram: protectedProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteProgram(input.id);
        return { success: true };
      }),

    // JOB LISTINGS
    getJobListings: publicProcedure.query(() => db.getJobListings()),
    getAllJobListings: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllJobListings();
    }),
    createJobListing: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          location: z.string(),
          description: z.string(),
          requirements: z.string().optional(),
          jobType: z.string().optional(),
          salary: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // ✅ FIXED: Removed 'isActive' and just sending standard input
        // (Assuming DB defaults active to true, or we let DB handle it)
        return await db.createJobListing(input);
      }),
    updateJobListing: protectedProcedure
      .input(
        z.object({
          id: z.union([z.string(), z.number()]).transform(String),
          title: z.string().optional(),
          location: z.string().optional(),
          description: z.string().optional(),
          requirements: z.string().optional(),
          jobType: z.string().optional(),
          salary: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateJobListing(id, data);
        return { success: true };
      }),
    deleteJobListing: protectedProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteJobListing(input.id);
        return { success: true };
      }),

    // STUDENT APPLICATIONS
    getApplications: protectedProcedure.query(async ({ ctx }) => {
      return await db.getStudentApplications();
    }),

    createApplication: publicProcedure
      .input(
        z.object({
          fullName: z.string(),
          email: z.string(),
          phone: z.string().optional(),
          message: z.string().optional(),
          courseId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        // ✅ FIXED: Added 'status' property
        return await db.createStudentApplication({
            ...input,
            status: "pending" 
        });
      }),

    deleteApplication: protectedProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteStudentApplication(input.id);
        return { success: true };
      }),

    // CONTACT MESSAGES
    getMessages: protectedProcedure.query(async ({ ctx }) => {
      return await db.getContactMessages();
    }),

    createMessage: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string(),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string(),
          messageType: z.string().default("contact"),
        })
      )
      .mutation(async ({ input }) => {
        // ✅ FIXED: Added 'status' property
        return await db.createContactMessage({
            ...input,
            status: "unread"
        });
      }),

    deleteMessage: protectedProcedure
      .input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteContactMessage(input.id);
        return { success: true };
      }),

    // BLOGS
    getBlogPosts: publicProcedure.query(() => db.getBlogPosts()),
    createBlogPost: protectedProcedure
    .input(z.object({
        title: z.string(), author: z.string(), content: z.string(),
        summary: z.string().optional(), imageUrl: z.string().optional(),
        publishedAt: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
        return await db.createBlogPost({ ...input, publishedAt: input.publishedAt || new Date() });
    }),
    updateBlogPost: protectedProcedure.input(z.object({
        id: z.union([z.string(), z.number()]).transform(String),
        title: z.string().optional(), author: z.string().optional(),
        content: z.string().optional(), summary: z.string().optional(),
        imageUrl: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const { id, ...data } = input; await db.updateBlogPost(id, data); return { success: true };
    }),
    deleteBlogPost: protectedProcedure.input(z.object({ id: z.union([z.string(), z.number()]).transform(String) }))
    .mutation(async ({ ctx, input }) => { await db.deleteBlogPost(input.id); return { success: true }; }),
  }),
});

export type AppRouter = typeof appRouter;
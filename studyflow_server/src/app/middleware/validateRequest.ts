import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects } from "zod";

const validateRequest = (schema: AnyZodObject | ZodEffects<AnyZodObject>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }
  };
};

export default validateRequest;

import { z } from 'zod';

export const clientSchema = z.object({
    name: z.string().min(2, 'Client name is required'),
    gst: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    phone: z.string().optional(),
    address1: z.string().min(1, 'Address Line 1 is required'),
    address2: z.string().optional(),
    pinCode: z.string().length(6, 'Pincode must be exactly 6 digits').optional().or(z.literal('')),
    state: z.string().min(2, 'State is required'),
    active: z.boolean().optional().default(true)
});


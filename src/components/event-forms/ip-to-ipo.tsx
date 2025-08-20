"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import {
  FormStepper,
  FormLayout,
  TextInput,
  RadioInput,
  TextareaInput,
  SelectInput,
  FileInput,
  FormActions,
  MemberDetails,
} from "@/components/ui/form-components";
import { TypographyP } from "@/components/ui/typography";
import { events, indianStates } from "@/data";
import { UploadToCloudinary } from "@/lib/utils";
import { apiCreateIpToIpoProject } from "@/api/events";

const teamMemberSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Invalid phone number." }),
  role: z.string().min(2, { message: "Role is required." }),
});

const formSchema = z.object({
  // Section 1: Basic Information
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Invalid email address." }),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  alternateContact: z.string().optional(),
  address: z.string().min(10, { message: "Address is required." }),

  // Section 2: Team Details
  applicationType: z.enum(["individual", "team"], {
    required_error: "Please specify if applying as individual or team.",
  }),
  memberCount: z
    .string()
    .refine(
      (val) =>
        ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(val),
      {
        message: "Please select the number of team members.",
      }
    ),
  teamMembers: z
    .array(teamMemberSchema)
    .min(1, { message: "At least 1 team member is required." })
    .max(10, { message: "Maximum 10 team members allowed." }),

  // Section 3: Educational/Professional Background
  educationalQualification: z
    .string()
    .min(2, { message: "Educational qualification is required." }),
  currentAffiliation: z
    .string()
    .min(2, { message: "Current affiliation is required." }),
  state: z.string({ required_error: "State is required." }),
  city: z.string({ required_error: "City is required." }),

  // Section 4: Idea/Project/Patent Details
  projectTitle: z.string().min(2, { message: "Project title is required." }),
  innovationCategory: z
    .string()
    .min(1, { message: "Innovation category is required." }),
  projectDescription: z
    .string()
    .min(50, {
      message: "Project description must be at least 50 characters.",
    })
    .describe("textarea"),
  iprStatus: z.enum(
    ["patent-granted", "patent-filed", "copyright-trademark", "no"],
    {
      required_error: "Please specify IPR status.",
    }
  ),
  iprProof: z.string().url({ message: "Upload your IPR Proof" }),

  // Section 5: Market & Impact
  problemStatement: z
    .string()
    .min(10, { message: "Problem statement is required." }),
  targetMarket: z
    .string()
    .min(10, { message: "Target market details are required." }),
  developmentStage: z.enum(["idea", "prototype", "pilot", "revenue"], {
    required_error: "Please specify development stage.",
  }),
  expectedImpact: z
    .string()
    .min(10, { message: "Expected impact is required." }),

  // Section 6: Funding & Business Potential
  priorFunding: z.enum(["yes", "no"], {
    required_error: "Please specify if you received prior funding.",
  }),
  fundingDetails: z.string().optional(),
  estimatedFunding: z
    .string()
    .min(1, { message: "Estimated funding requirement is required." }),
  revenueModel: z.string().min(10, { message: "Revenue model is required." }),

  // Section 7: Declaration & Consent
  // truthDeclaration: z.boolean().refine((val) => val === true, {
  //   message: "You must declare that the information is true.",
  // }),
  // consentToShare: z.boolean().refine((val) => val === true, {
  //   message: "You must consent to share details with organizers and investors.",
  // }),
});

export type FormValues = z.infer<typeof formSchema>;

const innovationCategories = [
  { value: "agriculture-food", label: "Agriculture & Food Tech" },
  { value: "healthcare-biotech", label: "Healthcare & BioTech" },
  { value: "cleantech-renewable", label: "CleanTech & Renewable Energy" },
  { value: "it-software", label: "IT & Software Solutions" },
  { value: "manufacturing-engineering", label: "Manufacturing & Engineering" },
];

const memberCountOptions = Array.from({ length: 10 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1} Member${i > 0 ? "s" : ""}`,
}));

export default function IpToIpoForm({
  onPaymentBtnOpen,
}: {
  onPaymentBtnOpen: (value: boolean) => void;
}) {
  const [step, setStep] = useState(1);

  const totalSteps = 6;
  const event = events.find((event) => event.id === "ip-to-ipo");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: undefined,
      applicationType: "individual",
      memberCount: "1",
      teamMembers: [{}],
      priorFunding: "no",
      iprStatus: "no",
      developmentStage: "idea",
      // truthDeclaration: false,
      // consentToShare: false,
    },
  });

  const {
    fields: members,
    remove,
    append,
  } = useFieldArray({
    name: "teamMembers",
    control: form.control,
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof FormValues)[] => {
    switch (step) {
      case 1:
        return [
          "fullName",
          "email",
          "mobileNumber",
          "alternateContact",
          "address",
        ];
      case 2:
        return ["applicationType", "memberCount", "teamMembers"];
      case 3:
        return [
          "educationalQualification",
          "currentAffiliation",
          "state",
          "city",
        ];
      case 4:
        return [
          "projectTitle",
          "innovationCategory",
          "projectDescription",
          "iprStatus",
          "iprProof",
        ];
      case 5:
        return [
          "problemStatement",
          "targetMarket",
          "developmentStage",
          "expectedImpact",
        ];
      case 6:
        return [
          "priorFunding",
          "fundingDetails",
          "estimatedFunding",
          "revenueModel",
        ];
      // case 7:
      //   return ["truthDeclaration", "consentToShare"];
      default:
        return [];
    }
  };

  useEffect(() => {
    const applicationType = form.watch("applicationType");
    const currentMembers = form.getValues("teamMembers");

    if (applicationType === "individual") {
      // Keep only the first member and set count to 1
      if (currentMembers.length > 1) {
        const firstMember = currentMembers[0];
        form.setValue("teamMembers", [firstMember]);
        form.setValue("memberCount", "1");
      }
    }
  }, [form.watch("applicationType"), form]);

  useEffect(() => {
    const applicationType = form.watch("applicationType");
    if (applicationType === "team") {
      const memberCount = Number.parseInt(form.watch("memberCount"));
      const currentMembers = form.getValues("teamMembers").length;

      if (memberCount > currentMembers) {
        for (let i = currentMembers; i < memberCount; i++) {
          append({
            name: "",
            email: "",
            phone: "",
            role: "",
          });
        }
      } else if (memberCount < currentMembers) {
        for (let i = currentMembers - 1; i >= memberCount; i--) {
          remove(i);
        }
      }
    }
  }, [
    form.watch("memberCount"),
    form.watch("applicationType"),
    append,
    remove,
    form,
  ]);

  function handleSubmit(paymentId: string) {
    toast.promise(
      apiCreateIpToIpoProject({
        paymentId,
        ...form.getValues(),
      }),
      {
        loading: "Submitting...",
        success: () => {
          window.location.reload();
          return "Application submitted successfully!!";
        },
        error: () => "Failed to submit your application",
      }
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-2">IP to IPO Application Form</h1>
      <TypographyP className="!mt-0 mb-4">
        Please fill out all sections of this application form to submit your
        startup.
      </TypographyP>
      <FormStepper currentStep={step} totalSteps={totalSteps} />

      <FormLayout form={form}>
        {/* Section 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 1 - Basic Information
            </h2>
            <TextInput
              name="fullName"
              label="Full Name of Applicant / Team Leader"
              placeholder="Enter your full name"
            />
            <TextInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
            />
            <TextInput
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter 10-digit mobile number"
            />
            <TextInput
              name="alternateContact"
              label="Alternate Contact Number (Optional)"
              placeholder="Enter alternate contact number"
            />
            <TextareaInput
              name="address"
              label="Address"
              placeholder="Enter your complete address"
            />
          </div>
        )}

        {/* Section 2: Team Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 2 - Team Details
            </h2>
            <RadioInput
              name="applicationType"
              label="Are you applying as:"
              options={[
                { value: "individual", label: "Individual" },
                { value: "team", label: "Team" },
              ]}
            />
            {form.watch("applicationType") === "individual" && (
              <MemberDetails
                prefix="teamMembers.0"
                label="Your Details"
                description="Please provide your personal details"
                schema={teamMemberSchema}
              />
            )}
            {form.watch("applicationType") === "team" && (
              <>
                <SelectInput
                  name="memberCount"
                  label="Number of Team Members"
                  options={memberCountOptions}
                />
                {members.map((field, index) => (
                  <MemberDetails
                    key={field.id}
                    prefix={`teamMembers.${index}`}
                    label={`Team Member ${index + 1}`}
                    description={
                      index === 0
                        ? "Details of the team leader"
                        : "Details of team member"
                    }
                    schema={teamMemberSchema}
                  />
                ))}
              </>
            )}
          </div>
        )}

        {/* Section 3: Educational/Professional Background */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 3 - Educational / Professional Background
            </h2>
            <TextInput
              name="educationalQualification"
              label="Educational Qualification(s)"
              placeholder="Enter your educational qualifications"
            />
            <TextInput
              name="currentAffiliation"
              label="Current Affiliation / Organisation / Institution Name"
              placeholder="Enter your current affiliation"
            />
            <SelectInput
              name="state"
              label="State"
              options={indianStates.map((state) => ({
                value: state,
                label: state,
              }))}
            />
            <TextInput
              name="city"
              label="City"
              placeholder="Enter your city"
              disabled={!form.watch("state")}
            />
          </div>
        )}

        {/* Section 4: Idea/Project/Patent Details */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 4 - Idea / Project / Patent Details
            </h2>
            <TextInput
              name="projectTitle"
              label="Title of Project / Idea / Patent"
              placeholder="Enter your project title"
            />
            <SelectInput
              name="innovationCategory"
              label="Category of Innovation"
              options={innovationCategories}
            />
            <TextareaInput
              name="projectDescription"
              label="Description of Your Project / Idea"
              placeholder="Describe your project in 150-200 words"
              description="Please provide a detailed description (150-200 words limit)"
            />
            <RadioInput
              name="iprStatus"
              label="Is your idea protected by Intellectual Property Rights (IPR)?"
              options={[
                { value: "patent-granted", label: "Yes, Patent Granted" },
                { value: "patent-filed", label: "Yes, Patent Filed" },
                {
                  value: "copyright-trademark",
                  label: "Yes, Copyright / Trademark Registered",
                },
                { value: "no", label: "No" },
              ]}
            />
            {form.watch("iprStatus") !== "no" && (
              <FileInput
                name="iprProof"
                label="Upload Proof of IPR"
                accept=".pdf,.jpeg,.jpg,.doc,.docx"
                description="Upload proof of IPR (PDF, JPEG, DOC, max size 10MB)"
                onFileSelect={async (file) => {
                  const { success, url } = await UploadToCloudinary(file);
                  console.log("File upload result:", { success, url });
                  if (success) {
                    form.setValue("iprProof", url!);
                    toast.success("IPR uploaded successfully");
                  } else {
                    toast.error("Failed to upload IPR Proof");
                  }
                }}
              />
            )}
          </div>
        )}

        {/* Section 5: Market & Impact */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 5 - Market & Impact
            </h2>
            <TextareaInput
              name="problemStatement"
              label="Problem Statement Addressed by Your Innovation"
              placeholder="Describe the problem your innovation addresses"
            />
            <TextareaInput
              name="targetMarket"
              label="Target Market & Potential Users"
              placeholder="Describe your target market and potential users"
            />
            <RadioInput
              name="developmentStage"
              label="Stage of Development"
              options={[
                { value: "idea", label: "Idea Stage" },
                { value: "prototype", label: "Prototype Developed" },
                { value: "pilot", label: "Pilot Tested" },
                { value: "revenue", label: "Revenue Generating" },
              ]}
            />
            <TextareaInput
              name="expectedImpact"
              label="Expected Social / Economic Impact"
              placeholder="Describe the expected social and economic impact"
            />
          </div>
        )}

        {/* Section 6: Funding & Business Potential */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 6 - Funding & Business Potential
            </h2>
            <RadioInput
              name="priorFunding"
              label="Have you received any prior funding or investment?"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
            />
            {form.watch("priorFunding") === "yes" && (
              <TextareaInput
                name="fundingDetails"
                label="Source & Amount of Prior Funding"
                placeholder="Mention source and amount of prior funding"
              />
            )}
            <TextInput
              name="estimatedFunding"
              label="Estimated Funding Requirement"
              placeholder="Enter estimated funding requirement"
            />
            <TextareaInput
              name="revenueModel"
              label="Revenue Model"
              placeholder="Describe your revenue model"
            />
          </div>
        )}

        {/* Section 7: Declaration & Consent */}
        {/* {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Section 7 - Declaration & Consent
            </h2>
            <FormField
              name="truthDeclaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I declare that the information provided is true to the
                      best of my knowledge
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="consentToShare"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to share my details with organisers & potential
                      investors
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )} */}

        <FormActions
          currentStep={step}
          totalSteps={totalSteps}
          onPrevious={prevStep}
          onNext={nextStep}
          onOpen={onPaymentBtnOpen}
          callbackFn={handleSubmit}
          event={{ amount: event?.regFee!, name: "IP to IPO" }}
        />
      </FormLayout>
    </div>
  );
}

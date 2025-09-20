import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // Test email service configuration
    const testResult = {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailFrom: !!process.env.EMAIL_FROM,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      emailFromValue: process.env.EMAIL_FROM,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    // Try to send a test email if all required vars are present
    if (testResult.hasResendKey && testResult.hasEmailFrom) {
      try {
        const testEmail = await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: "test@example.com", // This will fail but we can see the error
          subject: "Test Email",
          html: "<p>This is a test</p>",
        });
        
        return NextResponse.json({
          ...testResult,
          emailTest: "Email service is working",
          testResult: testEmail,
        });
      } catch (emailError) {
        return NextResponse.json({
          ...testResult,
          emailTest: "Email service error",
          error: emailError instanceof Error ? emailError.message : String(emailError),
        });
      }
    }

    return NextResponse.json({
      ...testResult,
      emailTest: "Missing required environment variables",
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: "Test failed", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
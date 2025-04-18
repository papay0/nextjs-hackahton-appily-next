import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Default values
    const title = searchParams.get('title') || 'What do you want to build today?';
    const subtitle = searchParams.get('subtitle') || 'Prompt, run, edit, and publish your app on the Appily Store.';
    
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(to bottom right, #111, #0F172A)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Glow Effects */}
          <div style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)',
            borderRadius: '50%',
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, rgba(96, 165, 250, 0) 70%)',
            borderRadius: '50%',
          }} />
          
          {/* App Title */}
          <div style={{
            marginBottom: '40px',
            display: 'flex',
          }}>
            <span style={{
              fontSize: '32px',
              color: 'white',
              fontWeight: 'bold',
            }}>
              Appily
            </span>
          </div>
          
          {/* Main Text */}
          <h1 style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            {title}
          </h1>
          
          {/* Subtitle */}
          <p style={{
            fontSize: '36px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.3,
            marginTop: '0px',
          }}>
            {subtitle}
          </p>
          
          {/* Coming Soon Badge */}
          <div style={{
            marginTop: '48px',
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '8px 20px',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#3B82F6',
              marginRight: '10px',
            }} />
            <span style={{
              color: '#60A5FA',
              fontSize: '20px',
              fontWeight: 'bold',
            }}>
              Coming Soon
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.log(`Error generating image: ${e instanceof Error ? e.message : String(e)}`);
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
} 
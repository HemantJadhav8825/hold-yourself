import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default function OG() {

    return new ImageResponse(

        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(to bottom, #0f172a, #020617)',
                    color: 'white',
                    padding: '80px',
                }}
            >

                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 700,
                        marginBottom: 24,
                    }}
                >
                    Webelong
                </div>

                <div
                    style={{
                        fontSize: 36,
                        opacity: 0.8,
                    }}
                >
                    You belong. Even here.
                </div>

            </div>
        ),

        size

    )

}

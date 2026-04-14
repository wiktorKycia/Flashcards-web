import { Image } from 'expo-image'
import { useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { HelloWave } from '@/components/hello-wave'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Link } from 'expo-router'

const API_BASE_URL = 'http://localhost:3000'

type ApiResponse = {
    content?: string
}

export default function HomeScreen() {
    const [apiMessage, setApiMessage] = useState<string | null>(null)
    const [apiError, setApiError] = useState<string | null>(null)
    const [apiLoading, setApiLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        let isActive = true

        const load = async () => {
            try {
                setApiLoading(true)
                setApiError(null)

                const response = await fetch(`${API_BASE_URL}/`, {
                    signal: controller.signal
                })
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`)
                }

                const data = (await response.json()) as ApiResponse
                if (isActive) {
                    setApiMessage(data.content ?? 'No content')
                }
            } catch (error) {
                if (!isActive) {
                    return
                }
                if (error instanceof Error && error.name === 'AbortError') {
                    return
                }
                setApiError(
                    error instanceof Error ? error.message : 'Unknown error'
                )
            } finally {
                if (isActive) {
                    setApiLoading(false)
                }
            }
        }

        load()

        return () => {
            isActive = false
            controller.abort()
        }
    }, [])

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/partial-react-logo.png')}
                    style={styles.reactLogo}
                />
            }
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
                <HelloWave />
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 1: Try it</ThemedText>
                <ThemedText>
                    Edit{' '}
                    <ThemedText type="defaultSemiBold">
                        app/(tabs)/index.tsx
                    </ThemedText>{' '}
                    to see changes. Press{' '}
                    <ThemedText type="defaultSemiBold">
                        {Platform.select({
                            ios: 'cmd + d',
                            android: 'cmd + m',
                            web: 'F12'
                        })}
                    </ThemedText>{' '}
                    to open developer tools.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Backend status</ThemedText>
                {apiLoading ? (
                    <ThemedText>Loading...</ThemedText>
                ) : apiError ? (
                    <ThemedText type="defaultSemiBold">
                        Error: {apiError}
                    </ThemedText>
                ) : (
                    <ThemedText>{apiMessage}</ThemedText>
                )}
            </ThemedView>
            {/*<ThemedView style={styles.stepContainer}>*/}
            {/*    <Link href="/modal">*/}
            {/*        <Link.Trigger>*/}
            {/*            <ThemedText type="subtitle">*/}
            {/*                Step 67: Explore*/}
            {/*            </ThemedText>*/}
            {/*        </Link.Trigger>*/}
            {/*        <Link.Preview />*/}
            {/*        <Link.Menu>*/}
            {/*            <Link.MenuAction*/}
            {/*                title="Action"*/}
            {/*                icon="cube"*/}
            {/*                onPress={() => alert('Action pressed')}*/}
            {/*            />*/}
            {/*            <Link.MenuAction*/}
            {/*                title="Share"*/}
            {/*                icon="square.and.arrow.up"*/}
            {/*                onPress={() => alert('Share pressed')}*/}
            {/*            />*/}
            {/*            <Link.Menu title="More" icon="ellipsis">*/}
            {/*                <Link.MenuAction*/}
            {/*                    title="Delete"*/}
            {/*                    icon="trash"*/}
            {/*                    destructive*/}
            {/*                    onPress={() => alert('Delete pressed')}*/}
            {/*                />*/}
            {/*            </Link.Menu>*/}
            {/*        </Link.Menu>*/}
            {/*    </Link>*/}

            {/*    <ThemedText>*/}
            {/*        {`Tap the Explore tab to learn more about what's included in this starter app.`}*/}
            {/*    </ThemedText>*/}
            {/*</ThemedView>*/}
            {/*<ThemedView style={styles.stepContainer}>*/}
            {/*    <ThemedText type="subtitle">*/}
            {/*        Step 3: Get a fresh start*/}
            {/*    </ThemedText>*/}
            {/*    <ThemedText>*/}
            {/*        {`When you're ready, run `}*/}
            {/*        <ThemedText type="defaultSemiBold">*/}
            {/*            npm run reset-project*/}
            {/*        </ThemedText>{' '}*/}
            {/*        to get a fresh{' '}*/}
            {/*        <ThemedText type="defaultSemiBold">app</ThemedText>{' '}*/}
            {/*        directory. This will move the current{' '}*/}
            {/*        <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}*/}
            {/*        <ThemedText type="defaultSemiBold">app-example</ThemedText>.*/}
            {/*    </ThemedText>*/}
            {/*</ThemedView>*/}
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute'
    }
})

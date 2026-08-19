import { defineConfig, devices } from '@playwright/test'

// tests/apps subdir to port
const apps: Record<string, number> = {
    vite: 9993,
}

export default defineConfig({
    testDir: './tests',
    testMatch: /\.spec\.ts$/,
    testIgnore: './tests/apps/**',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        trace: 'on-first-retry',
    },

    projects: createProjects(),

    webServer: [createWebServer('vite')],
})

function createWebServer(name: keyof typeof apps) {
    return {
        command: 'pnpm dev --port ' + apps[name],
        cwd: 'tests/apps/' + name,
        url: 'http://localhost:' + apps[name],
        reuseExistingServer: !process.env.CI,
    }
}

function createProjects() {
    const browsers = [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ]
    return Object.keys(apps).flatMap(name => {
        return browsers.map(b => {
            return {
                name: `${b.name}:${name}`,
                use: {
                    ...b.use,
                    baseURL: 'http://localhost:' + apps[name],
                },
            }
        })
    })
}

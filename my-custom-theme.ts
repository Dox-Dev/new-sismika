
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "255 255 255",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #ff7b00 
		"--color-primary-50": "255 235 217", // #ffebd9
		"--color-primary-100": "255 229 204", // #ffe5cc
		"--color-primary-200": "255 222 191", // #ffdebf
		"--color-primary-300": "255 202 153", // #ffca99
		"--color-primary-400": "255 163 77", // #ffa34d
		"--color-primary-500": "255 123 0", // #ff7b00
		"--color-primary-600": "230 111 0", // #e66f00
		"--color-primary-700": "191 92 0", // #bf5c00
		"--color-primary-800": "153 74 0", // #994a00
		"--color-primary-900": "125 60 0", // #7d3c00
		// secondary | #d0614e 
		"--color-secondary-50": "248 231 228", // #f8e7e4
		"--color-secondary-100": "246 223 220", // #f6dfdc
		"--color-secondary-200": "243 216 211", // #f3d8d3
		"--color-secondary-300": "236 192 184", // #ecc0b8
		"--color-secondary-400": "222 144 131", // #de9083
		"--color-secondary-500": "208 97 78", // #d0614e
		"--color-secondary-600": "187 87 70", // #bb5746
		"--color-secondary-700": "156 73 59", // #9c493b
		"--color-secondary-800": "125 58 47", // #7d3a2f
		"--color-secondary-900": "102 48 38", // #663026
		// tertiary | #dfc207 
		"--color-tertiary-50": "250 246 218", // #faf6da
		"--color-tertiary-100": "249 243 205", // #f9f3cd
		"--color-tertiary-200": "247 240 193", // #f7f0c1
		"--color-tertiary-300": "242 231 156", // #f2e79c
		"--color-tertiary-400": "233 212 81", // #e9d451
		"--color-tertiary-500": "223 194 7", // #dfc207
		"--color-tertiary-600": "201 175 6", // #c9af06
		"--color-tertiary-700": "167 146 5", // #a79205
		"--color-tertiary-800": "134 116 4", // #867404
		"--color-tertiary-900": "109 95 3", // #6d5f03
		// success | #07c559 
		"--color-success-50": "218 246 230", // #daf6e6
		"--color-success-100": "205 243 222", // #cdf3de
		"--color-success-200": "193 241 214", // #c1f1d6
		"--color-success-300": "156 232 189", // #9ce8bd
		"--color-success-400": "81 214 139", // #51d68b
		"--color-success-500": "7 197 89", // #07c559
		"--color-success-600": "6 177 80", // #06b150
		"--color-success-700": "5 148 67", // #059443
		"--color-success-800": "4 118 53", // #047635
		"--color-success-900": "3 97 44", // #03612c
		// warning | #9b8a17 
		"--color-warning-50": "240 237 220", // #f0eddc
		"--color-warning-100": "235 232 209", // #ebe8d1
		"--color-warning-200": "230 226 197", // #e6e2c5
		"--color-warning-300": "215 208 162", // #d7d0a2
		"--color-warning-400": "185 173 93", // #b9ad5d
		"--color-warning-500": "155 138 23", // #9b8a17
		"--color-warning-600": "140 124 21", // #8c7c15
		"--color-warning-700": "116 104 17", // #746811
		"--color-warning-800": "93 83 14", // #5d530e
		"--color-warning-900": "76 68 11", // #4c440b
		// error | #8c66b1 
		"--color-error-50": "238 232 243", // #eee8f3
		"--color-error-100": "232 224 239", // #e8e0ef
		"--color-error-200": "226 217 236", // #e2d9ec
		"--color-error-300": "209 194 224", // #d1c2e0
		"--color-error-400": "175 148 200", // #af94c8
		"--color-error-500": "140 102 177", // #8c66b1
		"--color-error-600": "126 92 159", // #7e5c9f
		"--color-error-700": "105 77 133", // #694d85
		"--color-error-800": "84 61 106", // #543d6a
		"--color-error-900": "69 50 87", // #453257
		// surface | #353339 
		"--color-surface-50": "225 224 225", // #e1e0e1
		"--color-surface-100": "215 214 215", // #d7d6d7
		"--color-surface-200": "205 204 206", // #cdccce
		"--color-surface-300": "174 173 176", // #aeadb0
		"--color-surface-400": "114 112 116", // #727074
		"--color-surface-500": "53 51 57", // #353339
		"--color-surface-600": "48 46 51", // #302e33
		"--color-surface-700": "40 38 43", // #28262b
		"--color-surface-800": "32 31 34", // #201f22
		"--color-surface-900": "26 25 28", // #1a191c
		
	}
}
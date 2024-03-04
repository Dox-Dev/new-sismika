
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
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "255 255 255",
		"--on-warning": "0 0 0",
		"--on-error": "0 0 0",
		"--on-surface": "0 0 0",
		// =~= Theme Colors  =~=
		// primary | #d5dadc 
		"--color-primary-50": "249 249 250", // #f9f9fa
		"--color-primary-100": "247 248 248", // #f7f8f8
		"--color-primary-200": "245 246 246", // #f5f6f6
		"--color-primary-300": "238 240 241", // #eef0f1
		"--color-primary-400": "226 229 231", // #e2e5e7
		"--color-primary-500": "213 218 220", // #d5dadc
		"--color-primary-600": "192 196 198", // #c0c4c6
		"--color-primary-700": "160 164 165", // #a0a4a5
		"--color-primary-800": "128 131 132", // #808384
		"--color-primary-900": "104 107 108", // #686b6c
		// secondary | #af2315 
		"--color-secondary-50": "243 222 220", // #f3dedc
		"--color-secondary-100": "239 211 208", // #efd3d0
		"--color-secondary-200": "235 200 197", // #ebc8c5
		"--color-secondary-300": "223 167 161", // #dfa7a1
		"--color-secondary-400": "199 101 91", // #c7655b
		"--color-secondary-500": "175 35 21", // #af2315
		"--color-secondary-600": "158 32 19", // #9e2013
		"--color-secondary-700": "131 26 16", // #831a10
		"--color-secondary-800": "105 21 13", // #69150d
		"--color-secondary-900": "86 17 10", // #56110a
		// tertiary | #9adfc9 
		"--color-tertiary-50": "240 250 247", // #f0faf7
		"--color-tertiary-100": "235 249 244", // #ebf9f4
		"--color-tertiary-200": "230 247 242", // #e6f7f2
		"--color-tertiary-300": "215 242 233", // #d7f2e9
		"--color-tertiary-400": "184 233 217", // #b8e9d9
		"--color-tertiary-500": "154 223 201", // #9adfc9
		"--color-tertiary-600": "139 201 181", // #8bc9b5
		"--color-tertiary-700": "116 167 151", // #74a797
		"--color-tertiary-800": "92 134 121", // #5c8679
		"--color-tertiary-900": "75 109 98", // #4b6d62
		// success | #553b68 
		"--color-success-50": "230 226 232", // #e6e2e8
		"--color-success-100": "221 216 225", // #ddd8e1
		"--color-success-200": "213 206 217", // #d5ced9
		"--color-success-300": "187 177 195", // #bbb1c3
		"--color-success-400": "136 118 149", // #887695
		"--color-success-500": "85 59 104", // #553b68
		"--color-success-600": "77 53 94", // #4d355e
		"--color-success-700": "64 44 78", // #402c4e
		"--color-success-800": "51 35 62", // #33233e
		"--color-success-900": "42 29 51", // #2a1d33
		// warning | #cd9d85 
		"--color-warning-50": "248 240 237", // #f8f0ed
		"--color-warning-100": "245 235 231", // #f5ebe7
		"--color-warning-200": "243 231 225", // #f3e7e1
		"--color-warning-300": "235 216 206", // #ebd8ce
		"--color-warning-400": "220 186 170", // #dcbaaa
		"--color-warning-500": "205 157 133", // #cd9d85
		"--color-warning-600": "185 141 120", // #b98d78
		"--color-warning-700": "154 118 100", // #9a7664
		"--color-warning-800": "123 94 80", // #7b5e50
		"--color-warning-900": "100 77 65", // #644d41
		// error | #a2c715 
		"--color-error-50": "241 247 220", // #f1f7dc
		"--color-error-100": "236 244 208", // #ecf4d0
		"--color-error-200": "232 241 197", // #e8f1c5
		"--color-error-300": "218 233 161", // #dae9a1
		"--color-error-400": "190 216 91", // #bed85b
		"--color-error-500": "162 199 21", // #a2c715
		"--color-error-600": "146 179 19", // #92b313
		"--color-error-700": "122 149 16", // #7a9510
		"--color-error-800": "97 119 13", // #61770d
		"--color-error-900": "79 98 10", // #4f620a
		// surface | #262626 
		"--color-surface-50": "222 222 222", // #dedede
		"--color-surface-100": "212 212 212", // #d4d4d4
		"--color-surface-200": "201 201 201", // #c9c9c9
		"--color-surface-300": "168 168 168", // #a8a8a8
		"--color-surface-400": "103 103 103", // #676767
		"--color-surface-500": "38 38 38", // #262626
		"--color-surface-600": "34 34 34", // #222222
		"--color-surface-700": "29 29 29", // #1d1d1d
		"--color-surface-800": "23 23 23", // #171717
		"--color-surface-900": "19 19 19", // #131313
		
	}
}
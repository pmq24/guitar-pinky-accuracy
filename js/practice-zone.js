import { createApp } from 'https://unpkg.com/petite-vue?module'

export default function mount(id) {
	const element = getMountElement(id)
	const component = createComponent()
	component.mount("#" + element.id)
}

function getMountElement(id) {
	id = String(id)
	if (!id) {
		throw new Error("Id is required")
	}

	const e = document.getElementById(id)
  if (!e) {
    throw new Error(`Element with id "${id}" is not found`)
  }

	return e
}

function createComponent() {
	const options = {

		targetGeneratorId: null,
		target: null,

		onMounted,
		onUnmounted,

		onTargetClicked,

		clientHeight() {
			return this.root().clientHeight
		},
		clientWidth() {
			return this.root().clientWidth
		},
		root() {
			return this.$refs.root
		},
		target() {
			return this.$refs.target
		}
	}

	return createApp(options)
}

function onMounted() {
	this.targetGeneratorId = setInterval(() => {
		const x = Math.random() * this.clientWidth()
		const y = Math.random() * this.clientHeight()

		const target = this.target()

		target.style.left = x + "px"
    target.style.top = y + "px"
		target.disabled = false
	}, 2000)
}

function onUnmounted() {
	if (this.targetGeneratorId) {
		clearInterval(this.targetGeneratorId)
	}
}

function onTargetClicked() {
	const target = this.target()
	target.disabled = true

}

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
		// States
		targetGeneratorId: null,
		target: null,
		
		// Lifecycle hooks
		onMounted,
		onUnmounted,

		// Methods
		onRootTouchStart,
		onTargetClicked,

		// Helpers
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
		},
		touch() {
			return this.$refs.touch	
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

function onRootTouchStart(e) {
	if (!(e instanceof TouchEvent)) {
		throw new Error("A TouchEvent handler is bound to non-touch event")
	}

	const touchData = e.touches[0]

	const touch = this.touch()
	const root = this.root()
	const rootBoundingClientRect = root.getBoundingClientRect()

	const viewportLeftDifference = rootBoundingClientRect.left
  touch.style.left = touchData.clientX - viewportLeftDifference + "px"

	const viewportTopDifference = rootBoundingClientRect.top
	touch.style.top = touchData.clientY - viewportTopDifference + "px"

	touch.style.height = touchData.radiusX + "px"
	touch.style.width = touchData.radiusY + "px"
}

function onTargetClicked() {
	const target = this.target()
	target.disabled = true

}
